import { S3Client } from "@aws-sdk/client-s3"
import { normalizeUUID } from "phylopic-source-models/src"
import objectExists from "../s3utils/objectExists"

const filterStrings = (x: unknown): x is string => typeof x === "string"
const getExistingNodeUUIDs = async (client: S3Client, uuids: readonly string[]): Promise<readonly string[]> => {
    if (!uuids.length) {
        return uuids
    }
    return (
        await Promise.all<string | null>(
            uuids.map(async uuid => {
                const exists = await objectExists(client, {
                    Bucket: "source.phylopic.org",
                    Key: `nodes/${normalizeUUID(uuid)}/meta.json`,
                })
                return exists ? uuid : null
            }),
        )
    ).filter(filterStrings)
}
export default getExistingNodeUUIDs
