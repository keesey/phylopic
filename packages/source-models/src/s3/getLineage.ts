import { S3Client } from "@aws-sdk/client-s3"
import { UUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import isNode from "../detection/isNode.js"
import { Entity } from "../types/Entity.js"
import { Node } from "../types/Node.js"
import SOURCE_BUCKET_NAME from "./SOURCE_BUCKET_NAME.js"
export const getLineage = async (
    client: S3Client,
    specificUUID: UUID | null,
    generalUUID: UUID | null,
): Promise<readonly Entity<Node>[]> => {
    if (!specificUUID) {
        return []
    }
    const [specificValue] = await getJSON<Node>(
        client,
        {
            Bucket: SOURCE_BUCKET_NAME,
            Key: `nodes/${specificUUID}/meta.json`,
        },
        isNode,
    )
    const specific: Entity<Node> = {
        uuid: specificUUID,
        value: specificValue,
    }
    if (!generalUUID || specificUUID === generalUUID) {
        return [specific]
    }
    return [...(await getLineage(client, specificValue.parent, generalUUID)), specific]
}
export default getLineage
