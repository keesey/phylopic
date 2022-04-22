import { APIGatewayProxyResult } from "aws-lambda"
import { ClientBase } from "pg"
import { Link } from "phylopic-api-models/src"
import BUILD from "../build/BUILD"
import APIError from "../errors/APIError"
import STANDARD_HEADERS from "../headers/responses/STANDARD_HEADERS"
import { PoolClientService } from "../services/PoolClientService"
import getListObject from "./getListObject"
import getPageIndex from "./getPageIndex"
import getPageObject from "./getPageObject"
import getPageObjectJSONWithEmbedded from "./getPageObjectJSONWithEmbedded"
export interface Parameters<TEmbedded = Record<string, never>> {
    embed: ReadonlyArray<keyof TEmbedded>
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
    listQuery?: Readonly<Record<string, string>>
    page?: string
    service: PoolClientService
    userMessage?: string
}
const OK_RESULT: Pick<APIGatewayProxyResult, "headers" | "statusCode"> = {
    headers: STANDARD_HEADERS,
    statusCode: 200,
}
const getListResult = async <TEmbedded = Record<string, never>>({
    embed,
    getItemLinks,
    getItemLinksAndJSON,
    getTotalItems,
    itemsPerPage,
    listPath,
    listQuery = {},
    page,
    service,
    userMessage = "There was an error in a request for data.",
}: Parameters<TEmbedded>) => {
    let result: APIGatewayProxyResult
    const create404 = () =>
        new APIError(404, [
            {
                developerMessage: "The requested page is out of bounds.",
                field: "page",
                type: "RESOURCE_NOT_FOUND",
                userMessage,
            },
        ])
    const listQueryWithBuild = { ...listQuery, build: BUILD.toString(10) }
    if (!page) {
        const client = await service.getPoolClient()
        try {
            const totalItems = await getTotalItems(client)
            result = {
                ...OK_RESULT,
                body: JSON.stringify(getListObject(listPath, listQueryWithBuild, totalItems, itemsPerPage)),
            }
        } finally {
            client.release()
        }
    } else {
        const pageIndex = getPageIndex(page)
        if (embed.length > 0) {
            const client = await service.getPoolClient()
            try {
                const rawItems = await getItemLinksAndJSON(client, pageIndex * itemsPerPage, itemsPerPage + 1, embed)
                if (rawItems.length === 0) {
                    throw create404()
                }
                const lastPage = rawItems.length < itemsPerPage + 1
                const items = rawItems.slice(0, itemsPerPage)
                const itemLinks = items.map(([link]) => link)
                const itemsJSON = items.map(([, json]) => json)
                result = {
                    ...OK_RESULT,
                    body: JSON.stringify(
                        getPageObjectJSONWithEmbedded(
                            listPath,
                            { ...listQueryWithBuild, embed: [...embed].sort().join(" "), page },
                            pageIndex,
                            lastPage,
                            itemLinks,
                            itemsJSON,
                        ),
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
                        getPageObject(listPath, { ...listQueryWithBuild, page }, pageIndex, lastPage, itemLinks),
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
