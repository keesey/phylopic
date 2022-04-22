import { Pool } from "pg"
import { PoolClientService } from "../../services/PoolClientService"
let pool: Pool | undefined
const POOL_CLIENT_SERVICE: PoolClientService = {
    getPoolClient() {
        return (
            pool ??
            (pool = new Pool({
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 120000,
                max: 1,
                min: 0,
            }))
        ).connect()
    },
}
export default POOL_CLIENT_SERVICE
