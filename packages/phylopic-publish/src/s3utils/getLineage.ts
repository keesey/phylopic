import { S3Client } from "@aws-sdk/client-s3"
import { Entity, Node, UUID, validateNode } from "phylopic-source-models/src"
import getJSON from "./getJSON"

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
            Bucket: "source.phylopic.org",
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
