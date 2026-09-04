import type { ClientBase } from "pg"
import type { PgClientService } from "./PgClientService"

const withPgClient = async <T, TClient extends ClientBase = ClientBase>(
    service: PgClientService<TClient>,
    fn: (client: TClient) => Promise<T>,
): Promise<T> => {
    const client = await service.createPgClient()
    try {
        return await fn(client)
    } finally {
        await service.deletePgClient(client)
    }
}

export default withPgClient
