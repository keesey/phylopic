import type { TitledLink } from "@phylopic/api-models"
import { stringifyNormalized } from "@phylopic/utils"
import type { APIGatewayProxyResult } from "aws-lambda"
import { S3Client } from "@aws-sdk/client-s3"
import type { ClientBase } from "pg"
import APIError from "../errors/APIError"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import type { PgClientService } from "../services/PgClientService"
import type { S3ClientService } from "../services/S3ClientService"
import withPgClient from "../services/withPgClient"
import withS3Client from "../services/withS3Client"
import getListObject from "./getListObject"
import type { ListPageRow } from "./getListResult"
import getPageIndex from "./getPageIndex"
import getPageObject from "./getPageObject"
import getPageObjectJSONWithEmbedded from "./getPageObjectJSONWithEmbedded"

interface Parameters<TEmbedded = Record<string, never>> {
    embedListPageRows: (
        rows: readonly ListPageRow[],
        embed: ReadonlyArray<string & keyof TEmbedded>,
        client: S3Client,
    ) => Promise<readonly Readonly<[TitledLink, string]>[]>
    fetchListPageRows: (client: ClientBase, offset: number, limit: number) => Promise<readonly ListPageRow[]>
    getItemLinks: (client: ClientBase, offset: number, limit: number) => Promise<readonly TitledLink[]>
    getTotalItems: (client: ClientBase) => Promise<number>
    itemsPerPage: number
    listPath: string
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>
    page?: string
    service: PgClientService & S3ClientService
    userMessage?: string
    validEmbeds: ReadonlyArray<string & keyof TEmbedded>
}

type IndexParameters = Pick<Parameters, "getTotalItems" | "itemsPerPage" | "listPath" | "listQuery" | "service">

type ListParameters = Pick<
    Parameters,
    "getItemLinks" | "itemsPerPage" | "listPath" | "listQuery" | "service" | "userMessage"
> &
    Readonly<{ pageIndex: number }>

type ListWithEmbedsParameters<TEmbedded> = Pick<
    Parameters<TEmbedded>,
    | "embedListPageRows"
    | "fetchListPageRows"
    | "itemsPerPage"
    | "listPath"
    | "listQuery"
    | "page"
    | "service"
    | "userMessage"
    | "validEmbeds"
> &
    Readonly<{ pageIndex: number }>

const OK_RESULT: Pick<APIGatewayProxyResult, "headers" | "statusCode"> = {
    headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
    statusCode: 200,
}

const create404 = (userMessage: string) =>
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

const getIndex = async (parameters: IndexParameters) => {
    const { getTotalItems, itemsPerPage, listPath, listQuery, service } = parameters
    return withPgClient(service, async client => {
        const totalItems = await getTotalItems(client)
        return {
            ...OK_RESULT,
            body: stringifyNormalized(getListObject(listPath, listQuery, totalItems, itemsPerPage)),
        }
    })
}

const getList = async (parameters: ListParameters) => {
    const {
        getItemLinks,
        itemsPerPage,
        listPath,
        listQuery,
        pageIndex,
        service,
        userMessage = "There was an error in a request for data.",
    } = parameters
    return withPgClient(service, async client => {
        const rawItemLinks = await getItemLinks(client, pageIndex * itemsPerPage, itemsPerPage + 1)
        if (rawItemLinks.length === 0) {
            throw create404(userMessage)
        }
        const lastPage = rawItemLinks.length < itemsPerPage + 1
        const itemLinks = rawItemLinks.slice(0, itemsPerPage)
        return {
            ...OK_RESULT,
            body: stringifyNormalized(getPageObject(listPath, listQuery, pageIndex, lastPage, itemLinks)),
        }
    })
}

const getListWithEmbeds = async <TEmbedded>(parameters: ListWithEmbedsParameters<TEmbedded>) => {
    const {
        embedListPageRows,
        fetchListPageRows,
        itemsPerPage,
        listPath,
        listQuery,
        page,
        pageIndex,
        service,
        userMessage = "There was an error in a request for data.",
        validEmbeds,
    } = parameters
    const isValidEmbed = (x: unknown): x is string & keyof TEmbedded =>
        validEmbeds.includes(x as string & keyof TEmbedded)
    const embeds = Object.keys(listQuery)
        .filter(key => key.startsWith("embed_"))
        .map(key => key.slice("embed_".length))
        .filter(isValidEmbed)
    const rows = await withPgClient(service, client =>
        fetchListPageRows(client, pageIndex * itemsPerPage, itemsPerPage + 1),
    )
    const rawItems = await withS3Client(service, client => embedListPageRows(rows, embeds, client))
    if (rawItems.length === 0) {
        throw create404(userMessage)
    }
    const lastPage = rawItems.length < itemsPerPage + 1
    const items = rawItems.slice(0, itemsPerPage)
    const itemLinks = items.map(([link]) => link)
    const itemsJSON = items.map(([, json]) => json)
    return {
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
}

const getPostgresListResult = async <TEmbedded = Record<string, never>>(parameters: Parameters<TEmbedded>) => {
    const { listQuery, page } = parameters
    if (!page) {
        return getIndex(parameters)
    }
    const pageIndex = getPageIndex(page)
    if (listQuery.embed_items === "true") {
        return getListWithEmbeds({ ...parameters, pageIndex })
    }
    return getList({ ...parameters, pageIndex })
}

export default getPostgresListResult
