import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3"
import { Client, ClientBase, ClientConfig } from "pg"
export default class ClientProvider {
    protected pg: Client | null = null
    protected s3: S3Client | null = null
    constructor(
        protected pgConfig: string | ClientConfig | undefined = undefined,
        protected s3Config: S3ClientConfig = {},
    ) {}
    public async destroy() {
        this.s3?.destroy()
        if (this.pg) {
            await this.pg.end()
        }
        this.s3 = null
        this.pg = null
    }
    public getPG(): ClientBase {
        return this.pg ?? (this.pg = new Client(this.pgConfig))
    }
    public getS3(): S3Client {
        return this.s3 ?? (this.s3 = new S3Client(this.s3Config))
    }
}
