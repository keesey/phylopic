import { S3Client } from "@aws-sdk/client-s3"
import { S3Service } from "../../services/S3Service"
let client: S3Client | undefined
const S3_SERVICE: S3Service = {
    getS3Client() {
        return client || (client = new S3Client({}))
    },
}
export default S3_SERVICE
