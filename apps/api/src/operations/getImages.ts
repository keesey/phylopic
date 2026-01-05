import {
    DATA_MEDIA_TYPE,
    Image,
    ImageEmbedded,
    ImageLinks,
    ImageListParameters,
    IMAGE_EMBEDDED_PARAMETERS,
    isImage,
    isImageListParameters,
    TitledLink,
} from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import addFilterToQuery from "../entities/image/addFilterToQuery"
import parseEntityJSONAndEmbed from "../entities/parseEntityJSONAndEmbed"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import { PgClientService } from "../services/PgClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetImagesParameters = DataRequestHeaders & ImageListParameters
export type GetImagesService = PgClientService
const DEFAULT_TITLE = "[Untitled]"
const ITEMS_PER_PAGE = 48
const USER_MESSAGE = "There was a problem with a request to list silhouette images."
const getQueryBuilder = (parameters: ImageListParameters, results: "total" | "href" | "json") => {
    const builder = new QueryConfigBuilder()
    const selection =
        results === "total"
            ? 'COUNT(DISTINCT image."uuid") as total'
            : results === "href"
              ? 'image.title AS title,image."uuid" AS "uuid"'
              : 'image."json" AS "json",image.title AS title,image."uuid" AS "uuid"'
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
    SELECT "uuid",parent_uuid,build
        FROM node
        WHERE "uuid"=$::uuid AND build=$::bigint
    UNION
        SELECT n."uuid",n.parent_uuid,n.build
            FROM node n
            INNER JOIN clade cl ON cl."uuid"=n.parent_uuid AND cl.build=n.build
)
SELECT ${selection} FROM clade
    LEFT JOIN image_node ON clade."uuid"=image_node.node_uuid AND clade.build=image_node.build
    LEFT JOIN image ON image_node.image_uuid=image."uuid" AND image_node.build=image.build
    WHERE image."uuid" IS NOT NULL
`,
            [parameters.filter_clade, BUILD],
        )
    } else if (parameters.filter_name) {
        builder.add(
            `
SELECT ${selection} FROM node_name
    LEFT JOIN image_node ON node_name.node_uuid=image_node.node_uuid AND node_name.build=image_node.build
    LEFT JOIN image ON image_node.image_uuid=image."uuid" AND image_node.build=image.build
    WHERE node_name.normalized=$::character varying AND node_name.build=$::bigint AND image."uuid" IS NOT NULL
`,
            [parameters.filter_name, BUILD],
        )
    } else if (parameters.filter_collection) {
        builder.add(
            `SELECT ${selection} FROM collection LEFT JOIN image ON image."uuid"=ANY(collection.uuids) WHERE collection.uuid=$::uuid AND image.build=$::bigint`,
            [parameters.filter_collection, BUILD],
        )
    } else {
        builder.add(`SELECT ${selection} FROM image WHERE build=$::bigint`, [BUILD])
    }
    builder.add("AND image.unlisted=0::bit")
    addFilterToQuery(parameters, builder)
    if (results === "total") {
        // Add nothing
    } else if (parameters.filter_clade) {
        builder.add(
            `GROUP BY image.title,image."uuid",image.depth${
                results === "json" ? ',image."json"' : ""
            } ORDER BY image.depth,image."uuid"`,
        )
    } else if (parameters.filter_name || parameters.filter_node) {
        builder.add(
            `GROUP BY image.title,image."uuid",image.created${
                results === "json" ? ',image."json"' : ""
            } ORDER BY image.created DESC,image."uuid"`,
        )
    } else {
        const sortField =
            parameters.filter_modified_after || parameters.filter_modified_before
                ? `modified`
                : parameters.filter_modifiedFile_after || parameters.filter_modifiedFile_before
                  ? "modified_file"
                  : "created"
        builder.add(`ORDER BY image.${sortField} DESC,image."uuid"`)
    }
    return builder
}
const getTotalItems = (parameters: ImageListParameters) => async (client: ClientBase) => {
    const query = getQueryBuilder(parameters, "total").build()
    const queryResult = await client.query<{ total: string }>(query)
    return parseInt(queryResult.rows[0].total, 10) || 0
}
const getItemLinks =
    (parameters: ImageListParameters) =>
    async (client: ClientBase, offset: number, limit: number): Promise<readonly TitledLink[]> => {
        const queryBuilder = getQueryBuilder(parameters, "href")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ title: string | null; uuid: UUID }>(queryBuilder.build())
        return queryResult.rows.map(({ title, uuid }) => ({
            href: `/images/${uuid}?build=${BUILD}`,
            title: title || DEFAULT_TITLE,
        }))
    }
const getItemLinksAndJSON =
    (parameters: ImageListParameters) =>
    async (
        client: ClientBase,
        offset: number,
        limit: number,
        embeds: ReadonlyArray<string & keyof ImageEmbedded>,
    ): Promise<ReadonlyArray<Readonly<[TitledLink, string]>>> => {
        const queryBuilder = getQueryBuilder(parameters, "json")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ json: string; title: string | null; uuid: UUID }>(queryBuilder.build())
        if (!embeds.length) {
            return queryResult.rows.map(({ json, title, uuid }) => [
                { href: `/images/${uuid}?build=${BUILD}`, title: title || DEFAULT_TITLE },
                json,
            ])
        }
        return await Promise.all(
            queryResult.rows.map(async ({ json, title, uuid }) => {
                return [
                    { href: `/images/${uuid}?build=${BUILD}`, title: title || DEFAULT_TITLE },
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
    if (checkListRedirect<ImageEmbedded>(queryParameters, IMAGE_EMBEDDED_PARAMETERS, USER_MESSAGE)) {
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
