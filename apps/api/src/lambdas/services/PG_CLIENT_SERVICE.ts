import { Client } from "pg"
// import { Pool, PoolClient } from "pg"
import { PgClientService } from "../../services/PgClientService"
// let pool: Pool | undefined
const PG_CLIENT_SERVICE: PgClientService<Client> = {
    async createPgClient() {
        const client = new Client({ connectionTimeoutMillis: 10000 })
        await client.connect()
        return client
    },
    deletePgClient(client: Client) {
        return client.end()
    },
}
/*
const PG_CLIENT_SERVICE: PgClientService<PoolClient> = {
    createPgClient() {
        return (
            pool ??
            (pool = new Pool({
                allowExitOnIdle: true,
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 120000,
                max: 1,
                min: 0,
            }))
        ).connect()
    },
    async deletePgClient(client: PoolClient) {
        client.release()
    },
}
*/
export default PG_CLIENT_SERVICE
