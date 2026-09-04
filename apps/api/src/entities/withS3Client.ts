import { S3Client } from "@aws-sdk/client-s3"
import type { S3ClientService } from "../services/S3ClientService"

const withS3Client = async <T>(service: S3ClientService, fn: (client: S3Client) => Promise<T>): Promise<T> => {
    const client = service.createS3Client()
    try {
        return await fn(client)
    } finally {
        service.deleteS3Client(client)
    }
}

export default withS3Client
