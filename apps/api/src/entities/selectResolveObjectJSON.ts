import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import type { S3ClientService } from "../services/S3ClientService"
import ENTITY_JSON_SOURCE from "./ENTITY_JSON_SOURCE"
import selectResolveObjectJSONFromS3 from "./selectResolveObjectJSONFromS3"
import withS3Client from "./withS3Client"

const selectResolveObjectJSON = async (
    service: S3ClientService,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
): Promise<string | null> => {
    if (ENTITY_JSON_SOURCE === "postgres") {
        return null
    }
    return withS3Client(service, client => selectResolveObjectJSONFromS3(client, authority, namespace, objectID))
}

export default selectResolveObjectJSON
