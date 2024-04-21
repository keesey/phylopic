import { S3Client } from "@aws-sdk/client-s3"
import { getJSON, isAWSError } from "@phylopic/utils-aws"
import { unstable_cache } from "next/cache"
import { GAMES } from "~/games/GAMES"
import { toPath, type CalendarDate } from "../datetime"
import { GAMES_BUCKET_NAME } from "./GAMES_BUCKET_NAME"
export type GameInstance<TContent> = Readonly<{
    meta: Readonly<{
        author: Readonly<{
            href?: string
            name: string
        }>
    }>
    content: TContent
}>
export const getGameInstance = async <TContent = unknown>(
    code: string,
    date: CalendarDate,
): Promise<GameInstance<TContent> | null> => {
    if (!GAMES[code]) {
        return null
    }
    const path = toPath(date)
    return await unstable_cache(
        async () => {
            const client = new S3Client({})
            try {
                const response = await getJSON<GameInstance<TContent>>(client, {
                    Bucket: GAMES_BUCKET_NAME,
                    Key: `games/${encodeURIComponent(code)}${path}.json`,
                }) // :TODO: fault detection?
                return response[0]
            } catch (e) {
                if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
                    return null
                }
                throw e
            }
        },
        ["S3", GAMES_BUCKET_NAME, "games", code, date.year.toString(), date.month.toString(), date.day.toString()],
        {
            revalidate: false,
            tags: ["games", `games/${encodeURIComponent(code)}`, `games/${encodeURIComponent(code)}${path}`],
        },
    )()
}
