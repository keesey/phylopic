import {
    DATA_MEDIA_TYPE,
    isNode,
    isNodeLineageParameters,
    Node,
    NODE_EMBEDDED_PARAMETERS,
    NodeEmbedded,
    NodeLineageParameters,
    NodeLinks,
    TitledLink,
} from "@phylopic/api-models"
import { normalizeUUID, UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import parseEntityJSONAndEmbed from "../entities/parseEntityJSONAndEmbed"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { PgClientService } from "../services/PgClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetNodeLineageParameters = DataRequestHeaders & NodeLineageParameters
export type GetNodeLineageService = PgClientService
const DEFAULT_TITLE = "[Unnamed]"
const ITEMS_PER_PAGE = 48
const USER_MESSAGE = "There was a problem with a request to list taxonomic groups."
const getQueryBuilder = (uuid: UUID, results: "total" | "href" | "json") => {
    const builder = new QueryConfigBuilder()
    const selection =
        results === "total" ? 'COUNT("uuid") as total' : results === "href" ? 'title,"uuid"' : '"json","uuid"'
    const additional = results === "json" ? '"json",' : ""
    const additionalN = results === "json" ? 'n."json",' : ""
    builder.add(
        `
WITH RECURSIVE predecessors AS (
    SELECT ${additional}title,"uuid",parent_uuid,build,0 as lineage_index
        FROM node
        WHERE "uuid"=$::uuid AND build=$::bigint
    UNION
    SELECT ${additionalN}n.title,n."uuid",n.parent_uuid,n.build,suc.lineage_index + 1
        FROM node n
        INNER JOIN predecessors suc ON suc.parent_uuid=n."uuid" AND suc.build=n.build
)
SELECT ${selection} FROM predecessors
`,
        [uuid, BUILD],
    )
    if (results !== "total") {
        builder.add(`GROUP BY ${additional}title,"uuid",lineage_index ORDER BY lineage_index`)
    }
    return builder
}
const getTotalItems = (uuid: UUID) => async (client: ClientBase) => {
    const query = getQueryBuilder(uuid, "total").build()
    const queryResult = await client.query<{ total: string }>(query)
    return parseInt(queryResult.rows[0].total, 10) || 0
}
const getItemLinks =
    (uuid: UUID) =>
    async (client: ClientBase, offset: number, limit: number): Promise<readonly TitledLink[]> => {
        const queryBuilder = getQueryBuilder(uuid, "href")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ title: string | null; uuid: UUID }>(queryBuilder.build())
        return queryResult.rows.map(({ title, uuid }) => ({
            href: `/nodes/${uuid}?build=${BUILD}`,
            title: title || DEFAULT_TITLE,
        }))
    }
const getItemLinksAndJSON =
    (uuid: UUID) =>
    async (
        client: ClientBase,
        offset: number,
        limit: number,
        embeds: ReadonlyArray<string & keyof NodeEmbedded>,
    ): Promise<ReadonlyArray<Readonly<[TitledLink, string]>>> => {
        const queryBuilder = getQueryBuilder(uuid, "json")
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
export const getNodeLineage: Operation<GetNodeLineageParameters, GetNodeLineageService> = async (
    { accept, ...queryAndPathParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isNodeLineageParameters, USER_MESSAGE)
    const { uuid, ...queryParameters } = queryAndPathParameters
    const normalizedUUID = normalizeUUID(uuid)
    const path = `/nodes/${encodeURIComponent(normalizedUUID)}/lineage`
    if (checkListRedirect<NodeEmbedded>(queryParameters, NODE_EMBEDDED_PARAMETERS, USER_MESSAGE)) {
        return createBuildRedirect(path, { ...queryParameters, uuid: normalizedUUID })
    }
    if (uuid !== normalizedUUID) {
        return createPermanentRedirect(path, { ...queryParameters, uuid: normalizedUUID })
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    return await getListResult({
        getItemLinks: getItemLinks(normalizedUUID),
        getItemLinksAndJSON: getItemLinksAndJSON(normalizedUUID),
        getTotalItems: getTotalItems(normalizedUUID),
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: path,
        service,
        listQuery: queryParameters,
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
        validEmbeds: ["childNodes", "parentNode", "primaryImage"],
    })
}
export default getNodeLineage
