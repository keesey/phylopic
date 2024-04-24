import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { isDefined } from "@phylopic/utils"
import { isAWSError } from "@phylopic/utils-aws"
import { unstable_cache } from "next/cache"
import { type CalendarDate } from "../datetime"
import { pad } from "../datetime/pad"
import { GAMES_BUCKET_NAME } from "./GAMES_BUCKET_NAME"
export const getGameMonthList = async <TContent = unknown>(
    code: string,
    date: Omit<CalendarDate, "day">,
): Promise<readonly string[] | null> => {
    const prefix = `games/${encodeURIComponent(code)}/${encodeURIComponent(pad(date.year, 4))}/${encodeURIComponent(pad(date.month, 2))}`
    return await unstable_cache(
        async () => {
            const client = new S3Client({})
            try {
                const response = await client.send(
                    new ListObjectsV2Command({
                        Prefix: `games/${encodeURIComponent(code)}/${encodeURIComponent(pad(date.year, 4))}/${encodeURIComponent(pad(date.month, 2))}/`,
                        MaxKeys: 31,
                        Bucket: GAMES_BUCKET_NAME,
                        Delimiter: "/",
                    }),
                )
                return response.Contents?.map(content => content.Key).filter(isDefined) ?? null
            } catch (e) {
                if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
                    return null
                }
                throw e
            } finally {
                client.destroy()
            }
        },
        ["S3", GAMES_BUCKET_NAME, "games", code, date.year.toString(), date.month.toString()],
        {
            revalidate: 60,
            tags: ["games", `games/${encodeURIComponent(code)}`, prefix],
        },
    )()
}
