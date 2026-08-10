import BaseSourceClient, { PoolClientProvider } from "@phylopic/source-client"
import { Pool } from "pg"
import { createContributeS3ClientConfig } from "~/aws/createAwsClientConfig"
const POOL = new Pool({
    database: "phylopic-source",
})
export default class SourceClient extends BaseSourceClient {
    constructor() {
        const provider = new PoolClientProvider(POOL, createContributeS3ClientConfig())
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
