import { S3Client } from "@aws-sdk/client-s3"
import selectStaticJSONFromS3 from "./selectStaticJSONFromS3"

const selectNamespacesJSON = async (client: S3Client): Promise<string | null> =>
    selectStaticJSONFromS3(client, "namespaces")

export default selectNamespacesJSON
