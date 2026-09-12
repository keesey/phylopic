import BaseSourceClient, { createSourcePool, PoolClientProvider } from "@phylopic/source-client"
const POOL = createSourcePool()
export default class SourceClient extends BaseSourceClient {
    constructor() {
        const provider = new PoolClientProvider(POOL, {
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            region: process.env.S3_REGION!,
        })
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
