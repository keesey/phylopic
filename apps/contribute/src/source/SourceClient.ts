import BaseSourceClient, { PoolClientProvider } from "@phylopic/source-client"
import { createAwsClientConfig } from "@phylopic/utils-aws"
import { Pool } from "pg"
const POOL = new Pool({
    database: "phylopic-source",
})
export default class SourceClient extends BaseSourceClient {
    constructor() {
        const provider = new PoolClientProvider(
            POOL,
            createAwsClientConfig({
                region: process.env.S3_REGION!,
                accessKeyIdEnv: "S3_ACCESS_KEY_ID",
                secretAccessKeyEnv: "S3_SECRET_ACCESS_KEY",
            }),
        )
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
