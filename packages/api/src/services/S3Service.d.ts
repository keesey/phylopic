import { S3Client } from "@aws-sdk/client-s3"
export interface S3Service {
    getS3Client(): S3Client
}
