import type { S3ClientConfig } from "@aws-sdk/client-s3"
import type { SESClientConfig } from "@aws-sdk/client-ses"
import { awsCredentialsProvider } from "@vercel/functions/oidc"

const createContributeAwsClientConfig = (region: string): { region: string; credentials?: S3ClientConfig["credentials"] } => {
    const roleArn = process.env.AWS_ROLE_ARN
    if (roleArn) {
        return {
            region,
            credentials: awsCredentialsProvider({ roleArn }),
        }
    }
    return { region }
}

export const createContributeS3ClientConfig = (): S3ClientConfig => {
    const config = createContributeAwsClientConfig(process.env.S3_REGION!)
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    if (!process.env.AWS_ROLE_ARN && accessKeyId && secretAccessKey) {
        return { ...config, credentials: { accessKeyId, secretAccessKey }, forcePathStyle: true }
    }
    return { ...config, forcePathStyle: true }
}

export const createContributeSesClientConfig = (): SESClientConfig => {
    const config = createContributeAwsClientConfig(process.env.SES_REGION!)
    const accessKeyId = process.env.SES_ACCESS_KEY_ID
    const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY
    if (!process.env.AWS_ROLE_ARN && accessKeyId && secretAccessKey) {
        return { ...config, credentials: { accessKeyId, secretAccessKey } }
    }
    return config
}
