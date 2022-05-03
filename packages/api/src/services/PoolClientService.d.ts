import { PoolClient } from "pg"
export interface PoolClientService {
    getPoolClient(): Promise<PoolClient>
}
