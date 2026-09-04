import type { S3ClientService } from "../services/S3ClientService"
import selectStaticJSONFromS3 from "./selectStaticJSONFromS3"
import withS3Client from "./withS3Client"

const selectNamespacesJSON = async (service: S3ClientService): Promise<string | null> =>
    withS3Client(service, client => selectStaticJSONFromS3(client, "namespaces"))

export default selectNamespacesJSON
