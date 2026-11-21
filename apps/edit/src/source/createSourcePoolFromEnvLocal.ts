import { createSourcePool } from "@phylopic/source-client"
import { parse } from "dotenv"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import type { PoolConfig } from "pg"

/** Postgres settings from `.env.local`, not inherited shell `PG*` (e.g. from `publish`). */
export const createSourcePoolFromEnvLocal = (cwd = process.cwd()) => {
    const path = resolve(cwd, ".env.local")
    if (!existsSync(path)) {
        return createSourcePool()
    }
    const file = parse(readFileSync(path, "utf8"))
    const config: Pick<PoolConfig, "database" | "host" | "password" | "port" | "user"> = {
        database: "phylopic-source",
    }
    if (file.PGHOST) {
        config.host = file.PGHOST
    }
    if (file.PGUSER) {
        config.user = file.PGUSER
    }
    if (file.PGPASSWORD) {
        config.password = file.PGPASSWORD
    }
    if (file.PGPORT) {
        config.port = Number(file.PGPORT)
    }
    return createSourcePool(config)
}
