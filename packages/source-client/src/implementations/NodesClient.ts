import { Node } from "@phylopic/source-models"
import { Authority, Identifier, Namespace, ObjectID, UUID } from "@phylopic/utils"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { SourceClient } from "../interfaces/SourceClient"
import NODE_FIELDS from "./pg/constants/NODE_FIELDS"
import NODE_TABLE from "./pg/constants/NODE_TABLE"
import normalizeNode from "./pg/normalization/normalizeNode"
import PGLister from "./pg/PGLister"
type INodesClient = SourceClient["nodes"]
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
}
