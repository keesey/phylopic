import { External } from "@phylopic/source-models"
import { Authority, Namespace, ObjectID, UUID } from "@phylopic/utils"
import { Listable } from "../interfaces"
import { PGClientProvider } from "../interfaces/PGClientProvider"
const EXTERNALS_PAGE_SIZE = 1024
export default class NodeExternalsClient implements Listable<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }, number> {
    constructor(protected provider: PGClientProvider, protected uuid: UUID) {}
    async page(index = 0) {
        const client = await this.provider.getPG()
        const result = await client.query<Pick<External, "title"> & { authority: Authority; namespace: Namespace; objectID: ObjectID }>(
            `SELECT authority,"namespace",object_id AS "objectID",title FROM external WHERE node_uuid=$::uuid OFFSET $::bigint LIMIT $::bigint`,
            [this.uuid, index * EXTERNALS_PAGE_SIZE, EXTERNALS_PAGE_SIZE + 1],
        )
        return {
            items: result.rows.slice(0, EXTERNALS_PAGE_SIZE).map(item => ({ ...item, node: this.uuid })),
            next: result.rowCount >= EXTERNALS_PAGE_SIZE ? index + 1 : undefined,
        }
    }
    async totalItems() {
        const client = await this.provider.getPG()
        const result = await client.query<{ total: number }>(
            `SELECT COUNT(*) AS total FROM external WHERE node_uuid=$::uuid`,
            [this.uuid],
        )
        return result.rows[0].total
    }
    async totalPages() {
        return Math.ceil((await this.totalItems()) / EXTERNALS_PAGE_SIZE)
    }
}
