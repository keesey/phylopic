import { S3Client } from "@aws-sdk/client-s3"
export interface S3ClientService {
    createS3Client(): S3Client
    deleteS3Client(client: S3Client): void
}
