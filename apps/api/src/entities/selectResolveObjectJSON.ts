import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import type { S3ClientService } from "../services/S3ClientService"
import selectResolveObjectJSONFromS3 from "./selectResolveObjectJSONFromS3"
import withS3Client from "./withS3Client"

const selectResolveObjectJSON = async (
    service: S3ClientService,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
): Promise<string | null> =>
    withS3Client(service, client => selectResolveObjectJSONFromS3(client, authority, namespace, objectID))

export default selectResolveObjectJSON
