import { PoolClient } from "pg"
export declare interface PoolService {
    getPoolClient(): Promise<PoolClient>
}
