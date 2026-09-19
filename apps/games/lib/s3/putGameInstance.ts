import { S3Client } from "@aws-sdk/client-s3"
import { putJSON } from "@phylopic/utils-aws"
import { revalidateTag } from "next/cache"
import { GAMES } from "~/games/GAMES"
import { toPath, type CalendarDate } from "../datetime"
import { GAMES_BUCKET_NAME } from "./GAMES_BUCKET_NAME"
import { GameInstance } from "./GameInstance"
export const putGameInstance = async <TContent = unknown>(
    code: string,
    date: CalendarDate,
    instance: GameInstance<TContent>,
): Promise<void> => {
    if (!GAMES[code]) {
        throw new Error("Invalid game code.")
    }
    const path = `games/${encodeURIComponent(code)}${toPath(date)}`
    const client = new S3Client({})
    try {
        await putJSON(
            client,
            {
                Bucket: GAMES_BUCKET_NAME,
                Key: `${path}.json`,
            },
            instance,
        )
        revalidateTag(path)
        revalidateTag(path.replace(/\/.+$/, ""))
    } finally {
        client.destroy()
    }
}
