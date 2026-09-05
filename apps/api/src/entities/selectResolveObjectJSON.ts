import { S3Client } from "@aws-sdk/client-s3"
import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import { getResolveJSONKey } from "@phylopic/utils-s3"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"

const selectResolveObjectJSON = async (
    client: S3Client,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
): Promise<string | null> => selectJSONFromS3Entities(client, getResolveJSONKey(BUILD, authority, namespace, objectID))

export default selectResolveObjectJSON
