import { ClientBase } from "pg"
import {
    Image,
    ImageEmbedded,
    ImageLinks,
    ImageListParameters,
    IMAGE_EMBEDDED_PARAMETERS,
    isImage,
    isImageListParameters,
    Link,
} from "phylopic-api-models"
import { UUID } from "phylopic-utils"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import addFilterToQuery from "../entities/image/addFilterToQuery"
import parseEntityJSONAndEmbed from "../entities/parseEntityJSONAndEmbed"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import { PoolClientService } from "../services/PoolClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetImagesParameters = DataRequestHeaders & ImageListParameters
export type GetImagesService = PoolClientService
const ITEMS_PER_PAGE = 48
const USER_MESSAGE = "There was a problem with a request to list silhouette images."
const getQueryBuilder = (parameters: ImageListParameters, results: "total" | "uuid" | "json") => {
    const builder = new QueryConfigBuilder()
    const selection =
        results === "total"
            ? 'COUNT(image."uuid") as total'
            : results === "uuid"
            ? 'image."uuid" AS "uuid"'
            : 'image.json AS json,image."uuid" AS "uuid"'
    if (parameters.filter_node) {
        builder.add(
            `
SELECT ${selection} FROM image_node
    LEFT JOIN image ON image."uuid"=image_node.image_uuid AND image.build=image_node.build
    WHERE image_node.node_uuid=$::uuid AND image_node.build=$::bigint
`,
            [parameters.filter_node, BUILD],
        )
    } else if (parameters.filter_clade) {
        builder.add(
            `
WITH RECURSIVE clade AS (
    SELECT "uuid", parent_uuid, build
        FROM node
        WHERE "uuid"=$::uuid AND build=$::bigint
    UNION
        SELECT n."uuid", n.parent_uuid, n.build
            FROM node n
            INNER JOIN clade cl ON cl."uuid"=n.parent_uuid AND cl.build=n.build
)
SELECT ${selection} AS "uuid" FROM clade
    LEFT JOIN image_node ON clade."uuid"=image_node.node_uuid AND clade.build=image_node.build
    LEFT JOIN image ON image_node.image_uuid=image."uuid" AND image_node.build=image.build
    WHERE image."uuid" IS NOT NULL
`,
            [parameters.filter_clade, BUILD],
        )
    } else if (parameters.filter_name) {
        builder.add(
            `
SELECT ${selection} AS "uuid" FROM node_name
    LEFT JOIN image_node ON node_name.node_uuid=image_node.node_uuid AND node_name.build=image_node.build
    LEFT JOIN image ON image_node.image_uuid=image."uuid" AND image_node.build=image.build
    WHERE node_name.normalized=$::character varying AND node_name.build=$::bigint AND image."uuid" IS NOT NULL
`,
            [parameters.filter_name, BUILD],
        )
    } else {
        builder.add(`SELECT ${selection} FROM image WHERE build=$::bigint`, [BUILD])
    }
    addFilterToQuery(parameters, builder)
    if (results === "total") {
        builder.add('GROUP BY image."uuid"')
    } else if (parameters.filter_clade) {
        builder.add(
            `GROUP BY image."uuid",image.depth${
                results === "json" ? ",image.json" : ""
            } ORDER BY image.depth,image."uuid"`,
        )
    } else if (parameters.filter_name || parameters.filter_node) {
        builder.add(
            `GROUP BY image."uuid",image.created${
                results === "json" ? ",image.json" : ""
            } ORDER BY image.created DESC,image."uuid"`,
        )
    } else {
        builder.add('ORDER BY image.created DESC,image."uuid"')
    }
    return builder
}
const getTotalItems = (parameters: ImageListParameters) => async (client: ClientBase) => {
    const query = getQueryBuilder(parameters, "total").build()
    const queryResult = await client.query<{ total: number }>(query)
    return queryResult.rows[0].total ?? 0
}
const getItemLinks =
    (parameters: ImageListParameters) =>
    async (client: ClientBase, offset: number, limit: number): Promise<readonly Link[]> => {
        const queryBuilder = getQueryBuilder(parameters, "uuid")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ uuid: UUID }>(queryBuilder.build())
        return queryResult.rows.map(({ uuid }) => ({ href: `/images/${uuid}?build=${BUILD}` }))
    }
const getItemLinksAndJSON =
    (parameters: ImageListParameters) =>
    async (
        client: ClientBase,
        offset: number,
        limit: number,
        embeds: ReadonlyArray<string & keyof ImageEmbedded>,
    ): Promise<ReadonlyArray<Readonly<[Link, string]>>> => {
        const queryBuilder = getQueryBuilder(parameters, "json")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ json: string; uuid: UUID }>(queryBuilder.build())
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
export const getImages: Operation<GetImagesParameters, GetImagesService> = async (
    { accept, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryParameters, isImageListParameters, USER_MESSAGE)
    if (checkListRedirect(queryParameters, IMAGE_EMBEDDED_PARAMETERS, USER_MESSAGE)) {
        return createBuildRedirect("/images", queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    return await getListResult({
        getItemLinks: getItemLinks(queryParameters),
        getItemLinksAndJSON: getItemLinksAndJSON(queryParameters),
        getTotalItems: getTotalItems(queryParameters),
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: "/images",
        listQuery: queryParameters,
        service,
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
        validEmbeds: ["contributor", "generalNode", "nodes", "specificNode"],
    })
}
export default getImages
