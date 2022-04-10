import { S3Client } from "@aws-sdk/client-s3"
import getJSON from "phylopic-utils/src/aws/s3/getJSON"
import { Entity, Node, UUID } from "../models"
import { validateNode } from "../validation"
import SOURCE_BUCKET_NAME from "./SOURCE_BUCKET_NAME"
const getLineage = async (
    client: S3Client,
    specificUUID?: UUID,
    generalUUID?: UUID,
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
        validateNode,
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
