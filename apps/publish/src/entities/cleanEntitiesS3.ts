import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { deletePrefix } from "@phylopic/utils-aws"
import { ENTITIES_BUCKET } from "./constants.js"
import { getBuildPrefix } from "@phylopic/s3-entities"
const client = new S3Client({})
export const cleanEntitiesS3 = async (build: number, operator: "=" | "<>") => {
    if (operator === "=") {
        console.info(`Removing S3 objects for build ${build}...`)
        await deletePrefix(client, ENTITIES_BUCKET, getBuildPrefix(build))
        console.info(`Removed S3 objects for build ${build}.`)
        return
    }
    console.info(`Removing old S3 build prefixes (keeping build ${build})...`)
    let continuationToken: string | undefined
    do {
        const list = await client.send(
            new ListObjectsV2Command({
                Bucket: ENTITIES_BUCKET,
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
            await deletePrefix(client, ENTITIES_BUCKET, Prefix)
        }
        continuationToken = list.NextContinuationToken
    } while (continuationToken)
    console.info(`Removed old S3 build prefixes (kept build ${build}).`)
}
