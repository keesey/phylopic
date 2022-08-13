import { S3ClientConfig } from "@aws-sdk/client-s3"
import pg from "pg"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { S3ClientProvider } from "../interfaces/S3ClientProvider"
import { BaseClientProvider } from "./BaseClientProvider"
export class ClientProvider extends BaseClientProvider implements PGClientProvider, S3ClientProvider {
    protected pg: pg.Client | null = null
    constructor(
        protected readonly pgConfig: string | pg.ClientConfig | undefined = undefined,
        s3Config: S3ClientConfig = {},
    ) {
        super(s3Config)
    }
    public async destroy() {
        try {
            await super.destroy()
        } catch (e) {
            console.error(e)
        }
        if (this.pg) {
            try {
                await this.pg.end()
            } catch (e) {
                console.error(e)
            }
            this.pg = null
        }
    }
    public async getPG(): Promise<pg.ClientBase> {
        if (!this.pg) {
            this.pg = new pg.Client(this.pgConfig)
            try {
                await this.pg.connect()
            } catch (e) {
                this.pg = null
                throw e
            }
        }
        return this.pg
    }
}
