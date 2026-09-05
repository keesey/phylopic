import { S3Client } from "@aws-sdk/client-s3"
import BUILD from "../build/BUILD"
import { getStaticJSONKey } from "@phylopic/s3-entities"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"

const selectNamespacesJSON = async (client: S3Client): Promise<string | null> =>
    selectJSONFromS3Entities(client, getStaticJSONKey(BUILD, "namespaces"))

export default selectNamespacesJSON
