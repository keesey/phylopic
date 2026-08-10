import type { S3ClientConfig } from "@aws-sdk/client-s3"
import BaseSourceClient, { ClientProvider } from "@phylopic/source-client"

const createPublishS3ClientConfig = (): S3ClientConfig => {
    const region =
        process.env.S3_REGION ?? process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? "us-west-2"
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    if (accessKeyId && secretAccessKey) {
        return { region, credentials: { accessKeyId, secretAccessKey }, forcePathStyle: true }
    }
    return { region, forcePathStyle: true }
}

export default class SourceClient extends BaseSourceClient {
    constructor() {
        const provider = new ClientProvider(
            {
                database: "phylopic-source",
                host: process.env.PGHOST,
                password: process.env.PGPASSWORD,
                port: parseInt(process.env.PGPORT!, 10),
                user: process.env.PGUSER,
            },
            createPublishS3ClientConfig(),
        )
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
