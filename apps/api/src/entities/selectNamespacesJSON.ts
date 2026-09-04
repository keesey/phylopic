import type { S3ClientService } from "../services/S3ClientService"
import ENTITY_JSON_SOURCE from "./ENTITY_JSON_SOURCE"
import selectStaticJSONFromS3 from "./selectStaticJSONFromS3"
import withS3Client from "./withS3Client"

const selectNamespacesJSON = async (service: S3ClientService): Promise<string | null> => {
    if (ENTITY_JSON_SOURCE === "postgres") {
        return null
    }
    return withS3Client(service, client => selectStaticJSONFromS3(client, "namespaces"))
}

export default selectNamespacesJSON
