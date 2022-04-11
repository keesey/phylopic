import { APIGatewayProxyResult } from "aws-lambda"
import { PoolClient } from "pg"
import { Entity, Link } from "phylopic-api-types"
import STANDARD_HEADERS from "../headers/STANDARD_HEADERS"
import BUILD from "../build/BUILD"
import { PoolService } from "../services/PoolService"
import getListObject from "./getListObject"
import getPageIndex from "./getPageIndex"
import getPageObjectWithEmbedded from "./getPageObjectWithEmbedded"
import getPageObject from "./getPageObject"
import APIError from "../errors/APIError"
export interface Parameters<TEntity extends Entity, TEmbedded = Record<string, unknown>> {
    embed: ReadonlyArray<keyof TEmbedded>
    getItemLinks: (
        client: PoolClient,
        offset: number,
        limit: number,
        embed: readonly string[],
    ) => Promise<readonly Link[]>
    getItems: (
        client: PoolClient,
        offset: number,
        limit: number,
        embed: readonly string[],
    ) => Promise<readonly TEntity[]>
    getLinkFromItem: (item: TEntity, embed: readonly string[]) => Link
    getTotalItems: (client: PoolClient) => Promise<number>
    itemsPerPage: number
    listPath: string
    listQuery?: Readonly<Record<string, string>>
    page?: string
    service: PoolService
    userMessage?: string
}
const OK_RESULT: Pick<APIGatewayProxyResult, "headers" | "statusCode"> = {
    headers: STANDARD_HEADERS,
    statusCode: 200,
}
const getListResult = async <TEntity extends Entity, TEmbedded = Record<string, unknown>>({
    embed,
    getItemLinks,
    getItems,
    getLinkFromItem,
    getTotalItems,
    itemsPerPage,
    listPath,
    listQuery = {},
    page,
    service,
    userMessage = "There was an error in a request for data.",
}: Parameters<TEntity>) => {
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
                const rawItems = await getItems(client, pageIndex * itemsPerPage, itemsPerPage + 1, embed)
                if (rawItems.length === 0) {
                    throw create404()
                }
                const lastPage = rawItems.length < itemsPerPage + 1
                const items = rawItems.slice(0, itemsPerPage)
                const itemLinks = items.map(item => getLinkFromItem(item, embed))
                result = {
                    ...OK_RESULT,
                    body: JSON.stringify(
                        getPageObjectWithEmbedded(
                            listPath,
                            { ...listQueryWithBuild, embed: [...embed].sort().join(" "), page },
                            pageIndex,
                            lastPage,
                            itemLinks,
                            items,
                        ),
                    ),
                }
            } finally {
                client.release()
            }
        } else {
            const client = await service.getPoolClient()
            try {
                const rawItemLinks = await getItemLinks(client, pageIndex * itemsPerPage, itemsPerPage + 1, [])
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
