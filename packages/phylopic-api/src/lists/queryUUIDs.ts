import { PoolClient, QueryConfig } from "pg"
const queryUUIDs = async (client: PoolClient, config: QueryConfig) => {
    const result = await client.query<{ uuid: string }>(config)
    return result.rows.map(({ uuid }) => uuid)
}
export default queryUUIDs
