import BaseSourceClient, { ClientProvider } from "@phylopic/source-client"
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
            {
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                },
                region: process.env.S3_REGION!,
            },
        )
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
