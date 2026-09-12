import { Pool, PoolConfig } from "pg"

export type CreateSourcePoolOptions = Pick<PoolConfig, "database">

/** One connection per serverless instance; matches `@phylopic/api` `PG_CLIENT_SERVICE`. */
export const createSourcePool = (options: CreateSourcePoolOptions = { database: "phylopic-source" }) =>
    new Pool({
        ...options,
        allowExitOnIdle: true,
        connectionTimeoutMillis: 10_000,
        idleTimeoutMillis: 120_000,
        max: 1,
        min: 0,
    })
