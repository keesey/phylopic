import { TitledLink } from "@phylopic/api-models"
import { stringifyNormalized, UUID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import { ClientBase } from "pg"
import ENTITY_JSON_SOURCE from "../entities/ENTITY_JSON_SOURCE"
import selectJSONFromS3 from "../entities/selectJSONFromS3"
import APIError from "../errors/APIError"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import { PgClientService } from "../services/PgClientService"
import type { S3ClientService } from "../services/S3ClientService"
import getListObject from "./getListObject"
import getPageIndex from "./getPageIndex"
import getPageObject from "./getPageObject"
import getPageObjectJSONWithEmbedded from "./getPageObjectJSONWithEmbedded"
import hydrateListPageFromS3 from "./hydrateListPageFromS3"
import { hasExtraListEmbeds } from "./isS3ListEligible"
import type { S3ListSource } from "./S3ListSource"
import withS3Client from "../entities/withS3Client"
export type ListPageRow = Readonly<{
    json: string
    title: string | null
    uuid: UUID
}>
export interface Parameters<TEmbedded = Record<string, never>> {
    embedListPageRows: (
        rows: readonly ListPageRow[],
        embed: ReadonlyArray<string & keyof TEmbedded>,
        service: PgClientService & S3ClientService,
    ) => Promise<readonly Readonly<[TitledLink, string]>[]>
    fetchListPageRows: (client: ClientBase, offset: number, limit: number) => Promise<readonly ListPageRow[]>
    getItemLinks: (client: ClientBase, offset: number, limit: number) => Promise<readonly TitledLink[]>
    getTotalItems: (client: ClientBase) => Promise<number>
    itemsPerPage: number
    listPath: string
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>
    page?: string
    service: PgClientService & S3ClientService
    s3List?: S3ListSource
    userMessage?: string
    validEmbeds: ReadonlyArray<string & keyof TEmbedded>
}
const OK_RESULT: Pick<APIGatewayProxyResult, "headers" | "statusCode"> = {
    headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
    statusCode: 200,
}
const getListResult = async <TEmbedded = Record<string, never>>({
    embedListPageRows,
    fetchListPageRows,
    getItemLinks,
    getTotalItems,
    itemsPerPage,
    listPath,
    listQuery,
    page,
    s3List,
    service,
    userMessage = "There was an error in a request for data.",
    validEmbeds,
}: Parameters<TEmbedded>) => {
    let result: APIGatewayProxyResult
    const tryS3List = ENTITY_JSON_SOURCE !== "postgres" && s3List?.isEligible(listQuery) ? s3List : undefined
    if (!page) {
        if (tryS3List) {
            const body = await withS3Client(service, client => selectJSONFromS3(client, tryS3List.getIndexKey()))
            if (body !== null) {
                return {
                    ...OK_RESULT,
                    body,
                }
            }
            if (ENTITY_JSON_SOURCE === "s3") {
                console.warn("List index JSON is missing from S3; falling back to Postgres.", { listPath })
            }
        }
        const client = await service.createPgClient()
        try {
            const totalItems = await getTotalItems(client)
            result = {
                ...OK_RESULT,
                body: stringifyNormalized(getListObject(listPath, listQuery, totalItems, itemsPerPage)),
            }
        } finally {
            await service.deletePgClient(client)
        }
    } else {
        const pageIndex = getPageIndex(page)
        const create404 = () =>
            new APIError(
                404,
                [
                    {
                        developerMessage: "The requested page is out of bounds.",
                        field: "page",
                        type: "RESOURCE_NOT_FOUND",
                        userMessage,
                    },
                ],
                PERMANENT_HEADERS,
            )
        if (listQuery.embed_items === "true") {
            const isValidEmbed = (x: unknown): x is string & keyof TEmbedded =>
                validEmbeds.includes(x as string & keyof TEmbedded)
            const embeds = Object.keys(listQuery)
                .filter(key => key.startsWith("embed_"))
                .map(key => key.slice("embed_".length))
                .filter(isValidEmbed)
            if (tryS3List && !hasExtraListEmbeds(listQuery, validEmbeds) && embeds.length === 0) {
                const hydrated = await hydrateListPageFromS3(
                    service,
                    tryS3List.getPageKey,
                    listPath,
                    listQuery,
                    pageIndex,
                    page,
                )
                if (hydrated !== null) {
                    return {
                        ...OK_RESULT,
                        body: hydrated.body,
                    }
                }
                if (ENTITY_JSON_SOURCE === "s3") {
                    console.warn("List page JSON is missing from S3; falling back to Postgres.", {
                        listPath,
                        page: pageIndex,
                    })
                }
            }
            const client = await service.createPgClient()
            try {
                const rows = await fetchListPageRows(client, pageIndex * itemsPerPage, itemsPerPage + 1)
                if (ENTITY_JSON_SOURCE === "s3") {
                    await service.deletePgClient(client)
                }
                const rawItems = await embedListPageRows(rows, embeds, service)
                if (rawItems.length === 0) {
                    throw create404()
                }
                const lastPage = rawItems.length < itemsPerPage + 1
                const items = rawItems.slice(0, itemsPerPage)
                const itemLinks = items.map(([link]) => link)
                const itemsJSON = items.map(([, json]) => json)
                result = {
                    ...OK_RESULT,
                    body: getPageObjectJSONWithEmbedded(
                        listPath,
                        { ...listQuery, page },
                        pageIndex,
                        lastPage,
                        itemLinks,
                        itemsJSON,
                    ),
                }
            } finally {
                if (ENTITY_JSON_SOURCE !== "s3") {
                    await service.deletePgClient(client)
                }
            }
        } else {
            if (tryS3List) {
                const body = await withS3Client(service, client =>
                    selectJSONFromS3(client, tryS3List.getPageKey(pageIndex)),
                )
                if (body !== null) {
                    return {
                        ...OK_RESULT,
                        body,
                    }
                }
                if (ENTITY_JSON_SOURCE === "s3") {
                    console.warn("List page JSON is missing from S3; falling back to Postgres.", {
                        listPath,
                        page: pageIndex,
                    })
                }
            }
            const client = await service.createPgClient()
            try {
                const rawItemLinks = await getItemLinks(client, pageIndex * itemsPerPage, itemsPerPage + 1)
                if (rawItemLinks.length === 0) {
                    throw create404()
                }
                const lastPage = rawItemLinks.length < itemsPerPage + 1
                const itemLinks = rawItemLinks.slice(0, itemsPerPage)
                result = {
                    ...OK_RESULT,
                    body: stringifyNormalized(getPageObject(listPath, listQuery, pageIndex, lastPage, itemLinks)),
                }
            } finally {
                await service.deletePgClient(client)
            }
        }
    }
    return result
}
export default getListResult
