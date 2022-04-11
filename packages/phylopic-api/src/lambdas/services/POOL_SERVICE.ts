import { Pool } from "pg"
import { PoolService } from "../../services/PoolService"
let pool: Pool | undefined
const POOL_SERVICE: PoolService = {
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
export default POOL_SERVICE
