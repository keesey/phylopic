import {
    DATA_MEDIA_TYPE,
    isNode,
    isNodeLineageParameters,
    Node,
    NodeEmbedded,
    NodeLineageParameters,
    NodeLinks,
    NODE_EMBEDDED_PARAMETERS,
    TitledLink,
} from "@phylopic/api-models"
import { normalizeUUID, UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import { S3Client } from "@aws-sdk/client-s3"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import parseEntityJSONAndEmbed from "../entities/parseEntityJSONAndEmbed"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import checkListRedirect from "../pagination/checkListRedirect"
import getPostgresListResult from "../pagination/getPostgresListResult"
import { ListPageRow } from "../pagination/getListResult"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { PgClientService } from "../services/PgClientService"
import type { S3ClientService } from "../services/S3ClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"

type GetNodesParameters = DataRequestHeaders & NodeLineageParameters

type GetNodesService = PgClientService & S3ClientService

const DEFAULT_TITLE = "[Unnamed]"

const ITEMS_PER_PAGE = 48

const USER_MESSAGE = "There was a problem with a request to list taxonomic groups."

const VALID_EMBEDS = ["childNodes", "parentNode", "primaryImage"] as const

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

const fetchListPageRows =
    (uuid: UUID) =>
    async (client: ClientBase, offset: number, limit: number): Promise<readonly ListPageRow[]> => {
        const queryBuilder = getQueryBuilder(uuid, "json")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ json: string; title: string | null; uuid: UUID }>(queryBuilder.build())
        return queryResult.rows
    }

const embedListPageRows =
    () =>
    async (
        rows: readonly ListPageRow[],
        embeds: ReadonlyArray<string & keyof NodeEmbedded>,
        client: S3Client,
    ): Promise<readonly Readonly<[TitledLink, string]>[]> => {
        if (!embeds.length) {
            return rows.map(({ json, title, uuid }) => [
                { href: `/nodes/${uuid}?build=${BUILD}`, title: title || DEFAULT_TITLE },
                json,
            ])
        }
        return await Promise.all(
            rows.map(async ({ json, title, uuid }) => {
                return [
                    { href: `/nodes/${uuid}?build=${BUILD}`, title: title || DEFAULT_TITLE },
                    await parseEntityJSONAndEmbed<Node, NodeLinks>(client, json, embeds, isNode, "taxonomic group"),
                ]
            }),
        )
    }

const getNodeLineage: Operation<GetNodesParameters, GetNodesService> = async (
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
    return await getPostgresListResult({
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: path,
        listQuery: queryParameters,
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
        validEmbeds: VALID_EMBEDS,
        embedListPageRows: embedListPageRows(),
        fetchListPageRows: fetchListPageRows(normalizedUUID),
        getItemLinks: getItemLinks(normalizedUUID),
        getTotalItems: getTotalItems(normalizedUUID),
        service,
    })
}

export default getNodeLineage
