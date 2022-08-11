import type { S3Client } from "@aws-sdk/client-s3"
export interface S3ClientProvider {
    getS3(): S3Client
}
