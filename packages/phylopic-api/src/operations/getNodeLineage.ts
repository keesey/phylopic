import { ClientBase } from "pg"
import { NODE_EMBEDDED_PARAMETERS } from "phylopic-api-models"
import {
    isNode,
    isNodeLineageParameters,
    Link,
    Node,
    NodeEmbedded,
    NodeLineageParameters,
    NodeLinks,
} from "phylopic-api-models"
import { normalizeUUID } from "phylopic-utils"
import { UUID } from "phylopic-utils"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import parseEntityJSONAndEmbed from "../entities/parseEntityJSONAndEmbed"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { PoolClientService } from "../services/PoolClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetNodesParameters = DataRequestHeaders & NodeLineageParameters
export type GetNodesService = PoolClientService
const ITEMS_PER_PAGE = 48
const USER_MESSAGE = "There was a problem with a request to list taxonomic groups."
const getQueryBuilder = (uuid: UUID, results: "total" | "uuid" | "json") => {
    const builder = new QueryConfigBuilder()
    const selection = results === "total" ? 'COUNT("uuid") as total' : results === "uuid" ? '"uuid"' : 'json,"uuid"'
    builder.add(
        `
WITH RECURSIVE predecessors AS (
    SELECT "uuid",parent_uuid,build,0 as lineage_index
        FROM node
        WHERE "uuid"=$::uuid AND build=$::bigint
    UNION
    SELECT n."uuid",n.parent_uuid,n.build,suc.lineage_index + 1
        FROM node n
        INNER JOIN predecessors suc ON suc.parent_uuid=n."uuid" AND suc.build=n.build
)
SELECT ${selection} FROM predecessors
`,
        [uuid, BUILD],
    )
    if (results === "total") {
        builder.add('GROUP BY "uuid"')
    } else {
        builder.add('GROUP BY "uuid",lineage_index ORDER BY lineage_index')
    }
    return builder
}
const getTotalItems = (uuid: UUID) => async (client: ClientBase) => {
    const query = getQueryBuilder(uuid, "total").build()
    const queryResult = await client.query<{ total: number }>(query)
    return queryResult.rows[0].total ?? 0
}
const getItemLinks =
    (uuid: UUID) =>
        async (client: ClientBase, offset: number, limit: number): Promise<readonly Link[]> => {
            const queryBuilder = getQueryBuilder(uuid, "uuid")
            queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
            const queryResult = await client.query<{ uuid: UUID }>(queryBuilder.build())
            return queryResult.rows.map(({ uuid }) => ({ href: `/nodes/${uuid}?build=${BUILD}` }))
        }
const getItemLinksAndJSON =
    (uuid: UUID) =>
        async (
            client: ClientBase,
            offset: number,
            limit: number,
            embeds: ReadonlyArray<string & keyof NodeEmbedded>,
        ): Promise<ReadonlyArray<Readonly<[Link, string]>>> => {
            const queryBuilder = getQueryBuilder(uuid, "json")
            queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
            const queryResult = await client.query<{ json: string; uuid: UUID }>(queryBuilder.build())
            if (!embeds.length) {
                return queryResult.rows.map(({ json, uuid }) => [{ href: `/nodes/${uuid}?build=${BUILD}` }, json])
            }
            return await Promise.all(
                queryResult.rows.map(async ({ json, uuid }) => {
                    return [
                        { href: `/nodes/${uuid}?build=${BUILD}` },
                        await parseEntityJSONAndEmbed<Node, NodeLinks>(client, json, embeds, isNode, "taxonomic group"),
                    ]
                }),
            )
        }
export const getNodes: Operation<GetNodesParameters, GetNodesService> = async (
    { accept, ...queryAndPathParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isNodeLineageParameters, USER_MESSAGE)
    const { uuid, ...queryParameters } = queryAndPathParameters
    const normalizedUUID = normalizeUUID(uuid)
    const path = `/nodes/${encodeURIComponent(normalizedUUID)}/lineage`
    if (checkListRedirect(queryParameters, NODE_EMBEDDED_PARAMETERS, USER_MESSAGE)) {
        return createBuildRedirect(path, queryParameters)
    }
    if (uuid !== normalizedUUID) {
        return createPermanentRedirect(path, queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    return await getListResult({
        getItemLinks: getItemLinks(normalizedUUID),
        getItemLinksAndJSON: getItemLinksAndJSON(normalizedUUID),
        getTotalItems: getTotalItems(normalizedUUID),
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: path,
        service,
        listQuery: {},
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
        validEmbeds: ["childNodes", "parentNode", "primaryImage"],
    })
}
export default getNodes
