import BaseSourceClient, { PoolClientProvider } from "@phylopic/source-client"
import { Pool } from "pg"
const POOL = new Pool({
    database: "phylopic-source",
})
export default class SourceClient extends BaseSourceClient {
    constructor() {
        const provider = new PoolClientProvider(POOL, {
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
            region: process.env.AWS_REGION!,
        })
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
