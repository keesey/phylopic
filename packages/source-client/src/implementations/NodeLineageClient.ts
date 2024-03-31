import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { Listable } from "../interfaces"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import NODE_FIELDS from "./pg/constants/NODE_FIELDS"
import getFields from "./pg/fields/getFields"
import normalizeNode from "./pg/normalization/normalizeNode"
const LINEAGE_PAGE_SIZE = 64
export default class NodeLineageClient implements Listable<Node & { uuid: UUID }, number> {
    constructor(
        protected provider: PGClientProvider,
        protected uuid: UUID,
    ) {}
    async page(index = 0) {
        const client = await this.provider.getPG()
        const result = await client.query<Node & { uuid: UUID }>(
            `
            WITH RECURSIVE predecessors AS (
                SELECT ${NODE_FIELDS.map(
                    value => value.column + (value.type === "json" ? "::character varying" : ""),
                ).join(",")},0 AS lineage_index
                    FROM node
                    WHERE "uuid"=$1::uuid AND disabled=0::bit
                UNION
                SELECT ${NODE_FIELDS.map(
                    value => "n." + value.column + (value.type === "json" ? "::character varying" : ""),
                ).join(",")},suc.lineage_index + 1
                    FROM node n
                    INNER JOIN predecessors suc ON suc.parent_uuid=n."uuid"
            )
            SELECT ${getFields(NODE_FIELDS)} FROM predecessors
            GROUP BY ${NODE_FIELDS.map(
                value => value.property + (value.type === "json" ? "::character varying" : ""),
            ).join(",")},lineage_index ORDER BY lineage_index
            OFFSET $2::bigint LIMIT $3::bigint
        `,
            [this.uuid, index * LINEAGE_PAGE_SIZE, LINEAGE_PAGE_SIZE + 1],
        )
        return {
            items: result.rows.slice(0, LINEAGE_PAGE_SIZE).map(normalizeNode),
            next: (result.rowCount ?? 0) >= LINEAGE_PAGE_SIZE ? index + 1 : undefined,
        }
    }
    async totalItems() {
        const client = await this.provider.getPG()
        const result = await client.query<{ total: number }>(
            `
            WITH RECURSIVE predecessors AS (
                SELECT "uuid",parent_uuid,0 AS lineage_index
                    FROM node
                    WHERE "uuid"=$1::uuid AND disabled=0::bit
                UNION
                SELECT n."uuid",n.parent_uuid,suc.lineage_index + 1
                    FROM node n
                    INNER JOIN predecessors suc ON suc.parent_uuid=n."uuid"
            )
            SELECT COUNT("uuid") AS total FROM predecessors
        `,
            [this.uuid],
        )
        return result.rows[0].total
    }
    async totalPages() {
        return Math.ceil((await this.totalItems()) / LINEAGE_PAGE_SIZE)
    }
}
