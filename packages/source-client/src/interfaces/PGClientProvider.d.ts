import type { ClientBase } from "pg"
export interface PGClientProvider {
    getPG(): Promise<ClientBase>
}
