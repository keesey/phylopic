import {
    DATA_MEDIA_TYPE,
    isNode,
    isNodeListParameters,
    Node,
    NodeEmbedded,
    NodeLinks,
    NodeListParameters,
    NODE_EMBEDDED_PARAMETERS,
    TitledLink,
} from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import parseEntityJSONAndEmbed from "../entities/parseEntityJSONAndEmbed"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import { PgClientService } from "../services/PgClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetNodesParameters = DataRequestHeaders & NodeListParameters
export type GetNodesService = PgClientService
const DEFAULT_TITLE = "[Unnamed]"
const ITEMS_PER_PAGE = 48
const USER_MESSAGE = "There was a problem with a request to list taxonomic groups."
const getQueryBuilder = (parameters: NodeListParameters, results: "total" | "href" | "json") => {
    const builder = new QueryConfigBuilder()
    const selection =
        results === "total"
            ? 'COUNT(node."uuid") as total'
            : results === "href"
            ? 'node.title AS title,node."uuid" AS "uuid"'
            : 'node.json AS json,node.title AS title,node."uuid" AS "uuid"'
    if (parameters.filter_name) {
        builder.add(
            `
SELECT ${selection} FROM node_name
    LEFT JOIN node ON node_name.node_uuid=node."uuid" AND node_name.build=node.build
    WHERE node_name.normalized=$::character varying AND node_name.build=$::bigint AND node."uuid" IS NOT NULL
`,
            [parameters.filter_name, BUILD],
        )
    } else if (parameters.filter_collection) {
        builder.add(
            `SELECT ${selection} FROM collection LEFT JOIN node ON node."uuid"=ANY(collection.uuids) WHERE collection.uuid=$::uuid AND node.build=$::bigint`,
            [parameters.filter_collection, BUILD],
        )
    } else {
        builder.add(`SELECT ${selection} FROM node WHERE build=$::bigint`, [BUILD])
    }
    if (results === "total") {
        // Add nothing
    } else if (parameters.filter_name) {
        builder.add(
            `GROUP BY node."uuid",node.sort_index${results === "json" ? ",node.json" : ""} ORDER BY node.sort_index`,
        )
    } else {
        builder.add("ORDER BY node.sort_index")
    }
    return builder
}
const getTotalItems = (parameters: NodeListParameters) => async (client: ClientBase) => {
    const query = getQueryBuilder(parameters, "total").build()
    const queryResult = await client.query<{ total: string }>(query)
    return parseInt(queryResult.rows[0].total, 10) || 0
}
const getItemLinks =
    (parameters: NodeListParameters) =>
    async (client: ClientBase, offset: number, limit: number): Promise<readonly TitledLink[]> => {
        const queryBuilder = getQueryBuilder(parameters, "href")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ title: string | null; uuid: UUID }>(queryBuilder.build())
        return queryResult.rows.map(({ title, uuid }) => ({
            href: `/nodes/${uuid}?build=${BUILD}`,
            title: title || DEFAULT_TITLE,
        }))
    }
const getItemLinksAndJSON =
    (parameters: NodeListParameters) =>
    async (
        client: ClientBase,
        offset: number,
        limit: number,
        embeds: ReadonlyArray<string & keyof NodeEmbedded>,
    ): Promise<ReadonlyArray<Readonly<[TitledLink, string]>>> => {
        const queryBuilder = getQueryBuilder(parameters, "json")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ json: string; title: string | null; uuid: UUID }>(queryBuilder.build())
        if (!embeds.length) {
            return queryResult.rows.map(({ json, title, uuid }) => [
                { href: `/nodes/${uuid}?build=${BUILD}`, title: title || DEFAULT_TITLE },
                json,
            ])
        }
        return await Promise.all(
            queryResult.rows.map(async ({ json, title, uuid }) => {
                return [
                    { href: `/nodes/${uuid}?build=${BUILD}`, title: title || DEFAULT_TITLE },
                    await parseEntityJSONAndEmbed<Node, NodeLinks>(client, json, embeds, isNode, "taxonomic group"),
                ]
            }),
        )
    }
export const getNodes: Operation<GetNodesParameters, GetNodesService> = async (
    { accept, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryParameters, isNodeListParameters, USER_MESSAGE)
    if (checkListRedirect(queryParameters, NODE_EMBEDDED_PARAMETERS, USER_MESSAGE)) {
        return createBuildRedirect("/nodes", queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    return await getListResult({
        getItemLinks: getItemLinks(queryParameters),
        getItemLinksAndJSON: getItemLinksAndJSON(queryParameters),
        getTotalItems: getTotalItems(queryParameters),
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: "/nodes",
        service,
        listQuery: queryParameters,
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
        validEmbeds: ["childNodes", "parentNode", "primaryImage"],
    })
}
export default getNodes
