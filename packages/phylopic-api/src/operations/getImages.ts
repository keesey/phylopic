import { ClientBase } from "pg"
import {
    EmbeddableParameters,
    Image,
    ImageEmbedded,
    ImageLinks,
    ImageListParameters,
    IMAGE_EMBEDDED_PARAMETERS,
    isImage,
    isImageListParameters,
    Link,
} from "phylopic-api-models/src"
import { UUID } from "phylopic-utils/src"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import checkIfMatchBuild from "../build/checkIfMatchBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import parseEntityJSONAndEmbed from "../entities/parseEntityJSONAndEmbed"
import { ListRequestHeaders } from "../headers/requests/ListRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import { PoolClientService } from "../services/PoolClientService"
import create304 from "../utils/aws/create304"
import QueryConfigBuilder from "../utils/postgres/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetImagesParameters = ListRequestHeaders & ImageListParameters
export type GetImagesService = PoolClientService
const ITEMS_PER_PAGE = 48
const USER_MESSAGE = "There was a problem with a request to list silhouette images."
const getTotalItems = async (client: ClientBase) => {
    const builder = new QueryConfigBuilder("SELECT COUNT(uuid) as total FROM image WHERE build=$::bigint", [BUILD])
    const result = await client.query<{ total: number }>(builder.build())
    return result.rows[0].total
}
const getItemLinks = async (client: ClientBase, offset: number, limit: number): Promise<readonly Link[]> => {
    const queryResult = await client.query<{ uuid: UUID }>({
        text: "SELECT uuid from image WHERE build=$::bigint ORDER BY created DESC,uuid OFFSET $::bigint LIMIT $::bigint",
        values: [BUILD, offset, limit],
    })
    return queryResult.rows.map(({ uuid }) => ({ href: `/images/${uuid}?build=${BUILD}` }))
}
const getItemLinksAndJSON = async (
    client: ClientBase,
    offset: number,
    limit: number,
    embeds: ReadonlyArray<string & keyof ImageEmbedded>,
): Promise<ReadonlyArray<Readonly<[Link, string]>>> => {
    const queryResult = await client.query<{ json: string; uuid: UUID }>({
        text: "SELECT json,uuid from image WHERE build=$::bigint ORDER BY created DESC,uuid OFFSET $::bigint LIMIT $::bigint",
        values: [BUILD, offset, limit],
    })
    if (!embeds.length) {
        return queryResult.rows.map(({ json, uuid }) => [{ href: `/images/${uuid}?build=${BUILD}` }, json])
    }
    return await Promise.all(
        queryResult.rows.map(async ({ json, uuid }) => {
            return [
                { href: `/images/${uuid}?build=${BUILD}` },
                await parseEntityJSONAndEmbed<Image, ImageLinks>(client, json, embeds, isImage, "silhouette image"),
            ]
        }),
    )
}
const isEmbeddedParameter = (x: unknown): x is string & keyof EmbeddableParameters<ImageEmbedded> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IMAGE_EMBEDDED_PARAMETERS.includes(x as any)
export const getImages: Operation<GetImagesParameters, GetImagesService> = async (
    { accept, "if-match": ifMatch, "if-none-match": ifNoneMatch, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    checkIfMatchBuild(ifMatch)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    if (!queryParameters.build) {
        return createBuildRedirect("/images")
    }
    validate(queryParameters, isImageListParameters, USER_MESSAGE)
    if (checkListRedirect(queryParameters, [], USER_MESSAGE)) {
        return createBuildRedirect("/images", queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const embed = Object.keys(queryParameters)
        .filter(isEmbeddedParameter)
        .map(key => key.slice("embed_".length) as string & keyof ImageEmbedded)
    return await getListResult({
        embed,
        getItemLinks,
        getItemLinksAndJSON,
        getTotalItems,
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: "/images",
        service,
        listQuery: {},
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
    })
}
export default getImages
