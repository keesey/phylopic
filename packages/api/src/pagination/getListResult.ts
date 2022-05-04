import { Link } from "@phylopic/api-models"
import { APIGatewayProxyResult } from "aws-lambda"
import { ClientBase } from "pg"
import APIError from "../errors/APIError"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import { PoolClientService } from "../services/PoolClientService"
import getListObject from "./getListObject"
import getPageIndex from "./getPageIndex"
import getPageObject from "./getPageObject"
import getPageObjectJSONWithEmbedded from "./getPageObjectJSONWithEmbedded"
export interface Parameters<TEmbedded = Record<string, never>> {
    getItemLinks: (client: ClientBase, offset: number, limit: number) => Promise<readonly Link[]>
    getItemLinksAndJSON: (
        client: ClientBase,
        offset: number,
        limit: number,
        embed: ReadonlyArray<keyof TEmbedded>,
    ) => Promise<ReadonlyArray<Readonly<[Link, string]>>>
    getTotalItems: (client: ClientBase) => Promise<number>
    itemsPerPage: number
    listPath: string
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>
    page?: string
    service: PoolClientService
    userMessage?: string
    validEmbeds: ReadonlyArray<string & keyof TEmbedded>
}
const OK_RESULT: Pick<APIGatewayProxyResult, "headers" | "statusCode"> = {
    headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
    statusCode: 200,
}
const getListResult = async <TEmbedded = Record<string, never>>({
    getItemLinks,
    getItemLinksAndJSON,
    getTotalItems,
    itemsPerPage,
    listPath,
    listQuery,
    page,
    service,
    userMessage = "There was an error in a request for data.",
    validEmbeds,
}: Parameters<TEmbedded>) => {
    let result: APIGatewayProxyResult
    if (!page) {
        const client = await service.getPoolClient()
        try {
            const totalItems = await getTotalItems(client)
            result = {
                ...OK_RESULT,
                body: JSON.stringify(getListObject(listPath, listQuery, totalItems, itemsPerPage)),
            }
        } finally {
            client.release()
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
            const client = await service.getPoolClient()
            try {
                const rawItems = await getItemLinksAndJSON(client, pageIndex * itemsPerPage, itemsPerPage + 1, embeds)
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
                client.release()
            }
        } else {
            const client = await service.getPoolClient()
            try {
                const rawItemLinks = await getItemLinks(client, pageIndex * itemsPerPage, itemsPerPage + 1)
                if (rawItemLinks.length === 0) {
                    throw create404()
                }
                const lastPage = rawItemLinks.length < itemsPerPage + 1
                const itemLinks = rawItemLinks.slice(0, itemsPerPage)
                result = {
                    ...OK_RESULT,
                    body: JSON.stringify(
                        getPageObject(listPath, listQuery, pageIndex, lastPage, itemLinks),
                    ),
                }
            } finally {
                client.release()
            }
        }
    }
    return result
}
export default getListResult
