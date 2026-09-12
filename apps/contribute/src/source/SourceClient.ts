import BaseSourceClient, { createSourcePool, PoolClientProvider } from "@phylopic/source-client"
import { createContributeS3ClientConfig } from "~/aws/createAwsClientConfig"
const POOL = createSourcePool()
export default class SourceClient extends BaseSourceClient {
    constructor() {
        const provider = new PoolClientProvider(POOL, createContributeS3ClientConfig())
        super(provider)
        this.destroy = () => provider.destroy()
    }
    public readonly destroy: () => Promise<void>
}
