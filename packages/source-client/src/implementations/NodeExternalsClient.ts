import { External } from "@phylopic/source-models"
import { Authority, Namespace, ObjectID, UUID } from "@phylopic/utils"
import { Listable } from "../interfaces"
import { PGClientProvider } from "../interfaces/PGClientProvider"
const EXTERNALS_PAGE_SIZE = 1024
type INodeExternalsClient = Listable<
    External & { authority: Authority; namespace: Namespace; objectID: ObjectID },
    number
> & {
    namespace: (
        authority: Authority,
        namespace: Namespace,
    ) => Listable<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }, number>
}
export class NodeExternalsClient implements INodeExternalsClient {
    constructor(
        protected provider: PGClientProvider,
        protected uuid: UUID,
    ) {}
    namespace(authority: Authority, namespace: Namespace) {
        return new NodeExternalsNamespaceClient(this.provider, this.uuid, authority, namespace)
    }
    async page(index = 0) {
        const client = await this.provider.getPG()
        const result = await client.query<
            Pick<External, "title"> & { authority: Authority; namespace: Namespace; objectID: ObjectID }
        >(
            `SELECT authority,"namespace",object_id AS "objectID",title FROM external WHERE disabled=0::bit AND node_uuid=$1::uuid OFFSET $2::bigint LIMIT $3::bigint`,
            [this.uuid, index * EXTERNALS_PAGE_SIZE, EXTERNALS_PAGE_SIZE + 1],
        )
        return {
            items: result.rows.slice(0, EXTERNALS_PAGE_SIZE).map(item => ({ ...item, node: this.uuid })),
            next: result.rowCount ?? 0 >= EXTERNALS_PAGE_SIZE ? index + 1 : undefined,
        }
    }
    async totalItems() {
        const client = await this.provider.getPG()
        const result = await client.query<{ total: number }>(
            `SELECT COUNT(*) AS total FROM external WHERE disabled=0::bit AND node_uuid=$1::uuid`,
            [this.uuid],
        )
        return result.rows[0].total
    }
    async totalPages() {
        return Math.ceil((await this.totalItems()) / EXTERNALS_PAGE_SIZE)
    }
}
class NodeExternalsNamespaceClient
    implements Listable<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }, number>
{
    constructor(
        protected provider: PGClientProvider,
        protected uuid: UUID,
        protected authority: Authority,
        protected namespace: Namespace,
    ) {}
    async page(index = 0) {
        const client = await this.provider.getPG()
        const result = await client.query<Pick<External, "title"> & { objectID: ObjectID }>(
            `SELECT object_id AS "objectID",title FROM external WHERE disabled=0::bit AND node_uuid=$1::uuid AND authority=$2::character varying AND "namespace"=$3::character varying OFFSET $4::bigint LIMIT $5::bigint`,
            [this.uuid, this.authority, this.namespace, index * EXTERNALS_PAGE_SIZE, EXTERNALS_PAGE_SIZE + 1],
        )
        return {
            items: result.rows
                .slice(0, EXTERNALS_PAGE_SIZE)
                .map(item => ({ ...item, authority: this.authority, namespace: this.namespace, node: this.uuid })),
            next: result.rowCount ?? 0 >= EXTERNALS_PAGE_SIZE ? index + 1 : undefined,
        }
    }
    async totalItems() {
        const client = await this.provider.getPG()
        const result = await client.query<{ total: number }>(
            `SELECT COUNT(*) AS total FROM external WHERE disabled=0::bit AND node_uuid=$1::uuid AND authority=$2::character varying AND "namespace"=$3::character varying`,
            [this.uuid, this.authority, this.namespace],
        )
        return result.rows[0].total
    }
    async totalPages() {
        return Math.ceil((await this.totalItems()) / EXTERNALS_PAGE_SIZE)
    }
}
