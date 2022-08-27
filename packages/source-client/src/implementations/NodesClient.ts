import { Node } from "@phylopic/source-models"
import { Authority, Identifier, isNonemptyString, Namespace, ObjectID, UUID } from "@phylopic/utils"
import { Listable } from "../interfaces"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { NodesClient as INodesClient } from "../interfaces/SourceClient"
import NODE_FIELDS from "./pg/constants/NODE_FIELDS"
import NODE_TABLE from "./pg/constants/NODE_TABLE"
import normalizeNode from "./pg/normalization/normalizeNode"
import PGLister from "./pg/PGLister"
export default class NodesClient extends PGLister<Node, { uuid: UUID }> implements INodesClient {
    constructor(protected readonly provider: PGClientProvider) {
        super(provider, NODE_TABLE, 128, NODE_FIELDS, normalizeNode, '"names"::character varying')
    }
    async resolve(externals: readonly Readonly<{ authority: Authority; namespace: Namespace; objectID: ObjectID }>[]) {
        const client = await this.provider.getPG()
        const output = await client.query<
            Node & { authority: string; namespace: string; objectID: string; uuid: UUID }
        >(
            `SELECT "external".authority, "external"."namespace", "external".object_id AS "objectID", node."uuid", node.created, node.modified, node."names"::json, node.parent_uuid AS parent FROM "external" LEFT JOIN node ON "external".node_uuid=node."uuid" WHERE "external".disabled=0::bit AND node.disabled=0::bit AND (${externals
                .map(
                    (_, index) =>
                        `("external".authority=$${index * 3 + 1}::character varying AND "external"."namespace"=$${
                            index * 3 + 2
                        }::character varying AND "external".object_id=$${index * 3 + 3}::character varying)`,
                )
                .join(" OR ")})`,
            externals.reduce<string[]>(
                (prev, { authority, namespace, objectID }) => [...prev, authority, namespace, objectID],
                [],
            ),
        )
        return output.rows.reduce<Record<Identifier, Node & { uuid: UUID }>>(
            (prev, row) => ({
                ...prev,
                [[row.authority, row.namespace, row.objectID].map(x => encodeURIComponent(x)).join("/")]: {
                    ...normalizeNode({
                        created: row.created,
                        modified: row.modified,
                        names: row.names,
                        parent: row.parent,
                    }),
                    uuid: row.uuid,
                },
            }),
            {},
        )
    }
    search(text: string) {
        if (!isNonemptyString(text)) {
            throw new Error("Expected nonempty string.")
        }
        return new NodeSearchClient(this.provider, text)
    }
}
const SEARCH_PAGE_SIZE = 8
class NodeSearchClient implements Listable<Node & { uuid: UUID }, number> {
    constructor(protected readonly provider: PGClientProvider, protected readonly text: string) {}
    async page(index = 0) {
        const client = await this.provider.getPG()
        const output = await client.query<Node & { uuid: UUID }>(
            'SELECT "uuid", created, modified, "names"::json, parent FROM (SELECT uuid, created, modified, "names"::character varying, parent_uuid AS parent, json_array_elements(json_array_elements("names"))->>\'text\' ILIKE $4::character varying AS "match" FROM node ORDER BY "match" DESC LIMIT $1::bigint) AS matches WHERE "match"=true GROUP BY "uuid", created, modified, "names", parent ORDER BY "names"::character varying OFFSET $2::bigint LIMIT $3::bigint',
            [SEARCH_PAGE_SIZE * (index + 1) * 16, SEARCH_PAGE_SIZE * index, SEARCH_PAGE_SIZE, `%${this.text}%`],
        )
        if (!output.rowCount) {
            return {
                items: [],
            }
        }
        return {
            items: output.rows,
            next: index + 1,
        }
    }
    async totalItems() {
        const client = await this.provider.getPG()
        const output = await client.query<{ total: string }>(
            `SELECT COUNT("uuid") as total FROM (SELECT uuid, json_array_elements(json_array_elements("names"))->>'text' ILIKE $1::character varying AS "match" FROM node GROUP BY "uuid", "match" ORDER BY "match" DESC) AS matches WHERE "match"=true`,
            [`%${this.text}%`],
        )
        const value = parseInt(output.rows?.[0]?.total ?? "0", 10)
        return isNaN(value) ? 0 : value
    }
    async totalPages() {
        return Math.ceil((await this.totalItems()) / SEARCH_PAGE_SIZE)
    }
}
