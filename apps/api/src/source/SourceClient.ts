import BaseSourceClient, { PoolClientProvider } from "@phylopic/source-client"
import { Pool } from "pg"
const POOL = new Pool({ database: "phylopic-source" })
export default class SourceClient extends BaseSourceClient {
    constructor() {
        const provider = new PoolClientProvider(POOL)
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
