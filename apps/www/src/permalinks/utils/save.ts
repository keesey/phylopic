import type { S3Client } from "@aws-sdk/client-s3"
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { isAWSError } from "@phylopic/utils-aws"
import { Hash, stringifyNormalized } from "@phylopic/utils"
import { PermalinkData } from "../types/PermalinkData"
import { createHash } from "crypto"
import PERMALINKS_BUCKET_NAME from "../constants/PERMALINKS_BUCKET_NAME"
const exists = async (client: S3Client, Key: string): Promise<boolean> => {
    try {
        const output = await client.send(
            new HeadObjectCommand({
                Bucket: PERMALINKS_BUCKET_NAME,
                Key,
            }),
        )
        return typeof output.$metadata.httpStatusCode === "number" && output.$metadata.httpStatusCode === 200
    } catch (e) {
        if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
            return false
        }
        throw e
    }
}
const getHash = (data: string) => {
    const hashSum = createHash("sha256")
    hashSum.update(data)
    return hashSum.digest("hex")
}
const save = async (s3Client: S3Client, data: PermalinkData): Promise<Hash> => {
    const json = stringifyNormalized(data)
    const hash = getHash(json)
    const Key = `data/${encodeURIComponent(hash)}.json`
    if (!(await exists(s3Client, Key))) {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: PERMALINKS_BUCKET_NAME,
                Body: json,
                ContentType: "application/json",
                Key,
            }),
        )
    }
    return hash
}
export default save
