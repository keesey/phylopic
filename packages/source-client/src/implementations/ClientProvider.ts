import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3"
import pg from "pg"
export class ClientProvider {
    protected pg: pg.Client | null = null
    protected s3: S3Client | null = null
    constructor(
        protected readonly pgConfig: string | pg.ClientConfig | undefined = undefined,
        protected readonly s3Config: S3ClientConfig = {},
    ) {}
    public async destroy() {
        this.s3?.destroy()
        this.s3 = null
        if (this.pg) {
            await this.pg.end()
            this.pg = null
        }
    }
    public getPG(): pg.ClientBase {
        return this.pg ?? (this.pg = new pg.Client(this.pgConfig))
    }
    public getS3(): S3Client {
        return this.s3 ?? (this.s3 = new S3Client(this.s3Config))
    }
}
