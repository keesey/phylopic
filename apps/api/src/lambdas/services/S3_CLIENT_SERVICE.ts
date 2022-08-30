import { S3Client } from "@aws-sdk/client-s3"
import { S3ClientService } from "../../services/S3ClientService"
const S3_CLIENT_SERVICE: S3ClientService = {
    createS3Client() {
        return new S3Client({})
    },
    deleteS3Client(client: S3Client) {
        client.destroy()
    },
}
export default S3_CLIENT_SERVICE
