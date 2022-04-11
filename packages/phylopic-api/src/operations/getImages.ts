import { PoolClient } from "pg"
import { ImageListParameters, validateImageListParameters } from "phylopic-api-types"
import BUILD from "../build/BUILD"
import getJSONRange from "../entities/getJSONRange"
import image from "../entities/image"
import addFilterToQuery from "../entities/image/addFilterToQuery"
import getCachedList from "../lists/getCachedList"
import normalizeRange from "../lists/normalizeRange"
import queryUUIDs from "../lists/queryUUIDs"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { PoolService } from "../services/PoolService"
import { RedisService } from "../services/RedisService"
import { S3Service } from "../services/S3Service"
import create304 from "../utils/aws/create304"
import checkIfMatchBuild from "../build/checkIfMatchBuild"
import createQueryString from "../utils/http/createQueryString"
import matchesBuildETag from "../build/matchesBuildETag"
import QueryConfigBuilder from "../utils/postgres/QueryConfigBuilder"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export type GetImagesParameters = Partial<ImageListParameters> & {
    accept?: string
    "if-none-match"?: string
    "if-match"?: string
}
export type GetImagesService = PoolService & RedisService & S3Service
const getHRef = ({
    clade,
    embed,
    contributor,
    length = "16",
    license_by,
    license_nc,
    license_sa,
    name,
    node,
    start = "0",
}: ImageListParameters) => {
    const query = createQueryString({
        clade,
        contributor,
        embed,
        length,
        license_by,
        license_nc,
        license_sa,
        name,
        node,
        start,
    })
    return `/images?${query}`
}
const getTotalFromDatabase = async (client: PoolClient, params: ImageListParameters) => {
    const builder = new QueryConfigBuilder('SELECT COUNT("uuid") as total FROM image WHERE build=$::bigint', [BUILD])
    addFilterToQuery(params, builder)
    const result = await client.query<{ total: string }>(builder.build())
    return parseInt(result.rows[0].total, 10)
}
const getUUIDsFromDatabase = (
    client: PoolClient,
    params: ImageListParameters,
    range?: { start: number; length: number },
) => {
    const builder = new QueryConfigBuilder()
    if (params?.node) {
        builder.add(
            `
SELECT image."uuid" FROM image_node
    LEFT JOIN image ON image."uuid" = image_node.image_uuid AND image.build = image_node.build
    WHERE image_node.node_uuid=$::uuid AND image_node.build=$::bigint
`,
            [params.node, BUILD],
        )
    } else if (params?.clade) {
        builder.add(
            `
WITH RECURSIVE clade AS (
    SELECT "uuid", parent_uuid, build
        FROM node
        WHERE "uuid"=$::uuid AND build=$::bigint
    UNION
    SELECT n."uuid", n.parent_uuid, n.build
        FROM node n
        INNER JOIN clade cl ON cl."uuid" = n.parent_uuid AND cl.build = n.build
)
SELECT image."uuid" FROM clade
    LEFT JOIN image_node ON clade."uuid"=image_node.node_uuid AND clade.build=image_node.build
    LEFT JOIN image ON image_node.image_uuid=image."uuid" AND image_node.build=image.build
    WHERE image."uuid" IS NOT NULL
`,
            [params.clade, BUILD],
        )
    } else if (params?.name) {
        builder.add(
            `
SELECT image."uuid" FROM node_name
    LEFT JOIN image_node ON node_name.node_uuid = image_node.node_uuid AND node_name.build = image_node.build
    LEFT JOIN image ON image_node.image_uuid = image."uuid" AND image_node.build = image.build
    WHERE node_name.normalized=$::character varying AND node_name.build=$::bigint AND image."uuid" IS NOT NULL
`,
            [params.name, BUILD],
        )
    } else {
        builder.add('SELECT "uuid" FROM image WHERE build=$::bigint', [BUILD])
    }
    addFilterToQuery(params, builder)
    if (params?.clade) {
        builder.add(`GROUP BY image."uuid", image.depth ORDER BY image.depth, image."uuid"`)
    } else {
        builder.add(`GROUP BY image."uuid", image.created ORDER BY image.created DESC, image."uuid"`)
    }
    if (range) {
        builder.add("OFFSET $ LIMIT $", [range.start, range.length])
    }
    return queryUUIDs(client, builder.build())
}
export const getImages: Operation<GetImagesParameters, GetImagesService> = async (params, service) => {
    if (matchesBuildETag(params["if-none-match"])) {
        return create304()
    }
    checkIfMatchBuild(params["if-match"])
    checkAccept(params.accept, DATA_MEDIA_TYPE)
    checkValidation(validateImageListParameters(params), "Invalid attempt to load silhouette metadata.")
    const range = normalizeRange(params, image.userLabel)
    const href = getHRef(params)
    const [uuids, total] = await getCachedList({
        ...range,
        fallback: {
            all: client => getUUIDsFromDatabase(client, params),
            slice:
                params.clade || params.node || params.name
                    ? undefined
                    : client => getUUIDsFromDatabase(client, params, range),
            total: client => getTotalFromDatabase(client, params),
        },
        href,
        service,
    })
    const s3Client = service.getS3Client()
    const result = getJSONRange({
        ...params,
        ...range,
        href,
        s3Client,
        total,
        type: image,
        uuids,
    })
    s3Client.destroy()
    return result
}
export default getImages
