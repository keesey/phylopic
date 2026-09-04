import { S3Client } from "@aws-sdk/client-s3"
import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import selectResolveObjectJSONFromS3 from "./selectResolveObjectJSONFromS3"

const selectResolveObjectJSON = async (
    client: S3Client,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
): Promise<string | null> => selectResolveObjectJSONFromS3(client, authority, namespace, objectID)

export default selectResolveObjectJSON
