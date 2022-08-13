import { S3ClientConfig } from "@aws-sdk/client-s3"
import pg from "pg"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { S3ClientProvider } from "../interfaces/S3ClientProvider"
import { BaseClientProvider } from "./BaseClientProvider"
export class PoolClientProvider extends BaseClientProvider implements PGClientProvider, S3ClientProvider {
    protected pg: pg.PoolClient | null = null
    constructor(protected readonly pool: pg.Pool, s3Config: S3ClientConfig = {}) {
        super(s3Config)
    }
    public async destroy() {
        try {
            await super.destroy()
        } catch (e) {
            console.error(e)
        }
        if (this.pg) {
            this.pg.release()
            this.pg = null
        }
    }
    public async getPG(): Promise<pg.ClientBase> {
        if (!this.pg) {
            this.pg = await this.pool.connect()
        }
        return this.pg
    }
}
