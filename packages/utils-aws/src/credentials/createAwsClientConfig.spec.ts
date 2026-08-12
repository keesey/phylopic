import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const awsCredentialsProvider = vi.fn(({ roleArn }: { roleArn: string }) => ({
    type: "oidc",
    roleArn,
}))

vi.mock("@vercel/functions/oidc", () => ({
    awsCredentialsProvider: (options: { roleArn: string }) => awsCredentialsProvider(options),
}))

import createAwsClientConfig from "./createAwsClientConfig"

describe("createAwsClientConfig", () => {
    const originalEnv = process.env

    beforeEach(() => {
        process.env = { ...originalEnv }
        delete process.env.AWS_ROLE_ARN
        delete process.env.S3_ACCESS_KEY_ID
        delete process.env.S3_SECRET_ACCESS_KEY
        delete process.env.CUSTOM_ACCESS_KEY
        delete process.env.CUSTOM_SECRET_KEY
        awsCredentialsProvider.mockClear()
    })

    afterEach(() => {
        process.env = originalEnv
    })

    it("uses OIDC credentials when roleArn is provided", () => {
        const config = createAwsClientConfig({
            region: "us-east-1",
            roleArn: "arn:aws:iam::123456789012:role/example",
            forcePathStyle: true,
        })
        expect(awsCredentialsProvider).toHaveBeenCalledWith({
            roleArn: "arn:aws:iam::123456789012:role/example",
        })
        expect(config).toEqual({
            region: "us-east-1",
            credentials: { type: "oidc", roleArn: "arn:aws:iam::123456789012:role/example" },
            forcePathStyle: true,
        })
    })

    it("uses AWS_ROLE_ARN from the environment by default", () => {
        process.env.AWS_ROLE_ARN = "arn:aws:iam::123456789012:role/from-env"
        const config = createAwsClientConfig({ region: "eu-west-1" })
        expect(awsCredentialsProvider).toHaveBeenCalledWith({
            roleArn: "arn:aws:iam::123456789012:role/from-env",
        })
        expect(config.credentials).toEqual({
            type: "oidc",
            roleArn: "arn:aws:iam::123456789012:role/from-env",
        })
    })

    it("uses static credentials from default env var names", () => {
        process.env.S3_ACCESS_KEY_ID = "AKIAEXAMPLE"
        process.env.S3_SECRET_ACCESS_KEY = "secret-example"
        const config = createAwsClientConfig({ region: "us-west-2" })
        expect(awsCredentialsProvider).not.toHaveBeenCalled()
        expect(config).toEqual({
            region: "us-west-2",
            credentials: { accessKeyId: "AKIAEXAMPLE", secretAccessKey: "secret-example" },
            forcePathStyle: undefined,
        })
    })

    it("uses static credentials from custom env var names", () => {
        process.env.CUSTOM_ACCESS_KEY = "custom-key"
        process.env.CUSTOM_SECRET_KEY = "custom-secret"
        const config = createAwsClientConfig({
            region: "ap-southeast-1",
            accessKeyIdEnv: "CUSTOM_ACCESS_KEY",
            secretAccessKeyEnv: "CUSTOM_SECRET_KEY",
        })
        expect(config.credentials).toEqual({
            accessKeyId: "custom-key",
            secretAccessKey: "custom-secret",
        })
    })

    it("returns region-only config when no credentials are available", () => {
        const config = createAwsClientConfig({ region: "ca-central-1", forcePathStyle: false })
        expect(awsCredentialsProvider).not.toHaveBeenCalled()
        expect(config).toEqual({ region: "ca-central-1", forcePathStyle: false })
    })

    it("ignores incomplete static credentials", () => {
        process.env.S3_ACCESS_KEY_ID = "AKIAEXAMPLE"
        const config = createAwsClientConfig({ region: "us-east-1" })
        expect(config).toEqual({ region: "us-east-1", forcePathStyle: undefined })
    })
})
