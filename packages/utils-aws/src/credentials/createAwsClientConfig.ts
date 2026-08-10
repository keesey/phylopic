import type { AwsCredentialIdentityProvider } from "@smithy/types"

export type CreateAwsClientConfigOptions = {
    region: string
    /** IAM role ARN for Vercel OIDC. Defaults to `process.env.AWS_ROLE_ARN`. */
    roleArn?: string
    /** Static access key env var names for local development. */
    accessKeyIdEnv?: string
    secretAccessKeyEnv?: string
    forcePathStyle?: boolean
}

type AwsClientConfig = {
    region: string
    credentials?: AwsCredentialIdentityProvider | { accessKeyId: string; secretAccessKey: string }
    forcePathStyle?: boolean
}

/**
 * Builds AWS SDK client config for Vercel (OIDC role) or local dev (static keys).
 *
 * When `AWS_ROLE_ARN` is set, uses `@vercel/functions/oidc` to exchange the deploy
 * identity for short-lived credentials. Otherwise reads the named access-key env vars.
 */
const createAwsClientConfig = ({
    region,
    roleArn = process.env.AWS_ROLE_ARN,
    accessKeyIdEnv = "S3_ACCESS_KEY_ID",
    secretAccessKeyEnv = "S3_SECRET_ACCESS_KEY",
    forcePathStyle,
}: CreateAwsClientConfigOptions): AwsClientConfig => {
    if (roleArn) {
        // Loaded at runtime so `@vercel/functions` is only required on Vercel deployments.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { awsCredentialsProvider } = require("@vercel/functions/oidc") as typeof import("@vercel/functions/oidc")
        return {
            region,
            credentials: awsCredentialsProvider({
                roleArn,
            }),
            forcePathStyle,
        }
    }

    const accessKeyId = process.env[accessKeyIdEnv]
    const secretAccessKey = process.env[secretAccessKeyEnv]
    if (accessKeyId && secretAccessKey) {
        return {
            region,
            credentials: { accessKeyId, secretAccessKey },
            forcePathStyle,
        }
    }

    return { region, forcePathStyle }
}

export default createAwsClientConfig
