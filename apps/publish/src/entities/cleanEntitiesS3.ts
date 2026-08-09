import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { deletePrefix } from "@phylopic/utils-aws"
import { getEntitiesBucket } from "./constants.js"
import { getBuildPrefix } from "./getEntityJSONKey.js"
const client = new S3Client({})
export const cleanEntitiesS3 = async (build: number, operator: "=" | "<>") => {
    const bucket = getEntitiesBucket()
    if (operator === "=") {
        console.info(`Removing S3 objects for build ${build}...`)
        await deletePrefix(client, bucket, getBuildPrefix(build))
        console.info(`Removed S3 objects for build ${build}.`)
        return
    }
    console.info(`Removing old S3 build prefixes (keeping build ${build})...`)
    let continuationToken: string | undefined
    do {
        const list = await client.send(
            new ListObjectsV2Command({
                Bucket: bucket,
                ContinuationToken: continuationToken,
                Delimiter: "/",
            }),
        )
        for (const { Prefix } of list.CommonPrefixes ?? []) {
            if (!Prefix) {
                continue
            }
            const prefixBuild = Number.parseInt(Prefix.replace(/\/$/, ""), 10)
            if (Number.isNaN(prefixBuild) || prefixBuild === build) {
                continue
            }
            await deletePrefix(client, bucket, Prefix)
        }
        continuationToken = list.NextContinuationToken
    } while (continuationToken)
    console.info(`Removed old S3 build prefixes (kept build ${build}).`)
}
