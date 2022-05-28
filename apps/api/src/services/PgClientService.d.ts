import { ClientBase, PoolClient } from "pg"
export interface PgClientService<TClient extends ClientBase = ClientBase> {
    createPgClient(): Promise<TClient>
    deletePgClient(client: TClient): Promise<void>
}
