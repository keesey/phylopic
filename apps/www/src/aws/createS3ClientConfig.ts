import type { S3ClientConfig } from "@aws-sdk/client-s3"
import { awsCredentialsProvider } from "@vercel/functions/oidc"

/** S3 client config for Vercel OIDC or local static keys. */
const createS3ClientConfig = (): S3ClientConfig => {
    const region = process.env.S3_REGION!
    const roleArn = process.env.AWS_ROLE_ARN
    if (roleArn) {
        return {
            region,
            credentials: awsCredentialsProvider({ roleArn }),
        }
    }
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    if (accessKeyId && secretAccessKey) {
        return { region, credentials: { accessKeyId, secretAccessKey } }
    }
    return { region }
}

export default createS3ClientConfig
