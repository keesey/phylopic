import { PoolClient } from "pg"
import { NodeListParameters, validateNodeListParameters } from "phylopic-api-types"
import BUILD from "../build/BUILD"
import getJSONRange from "../entities/getJSONRange"
import node from "../entities/node"
import getCachedList from "../lists/getCachedList"
import normalizeRange from "../lists/normalizeRange"
import queryUUIDs from "../lists/queryUUIDs"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { PoolClientService } from "../services/PoolClientService"
import { RedisService } from "../services/RedisService"
import { S3Service } from "../services/S3Service"
import checkIfMatchBuild from "../build/checkIfMatchBuild"
import createQueryString from "../utils/http/createQueryString"
import QueryConfigBuilder from "../utils/postgres/QueryConfigBuilder"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export type GetNodesParameters = Partial<NodeListParameters> & {
    accept?: string
    "if-none-match"?: string
    "if-match"?: string
}
export type GetNodesService = PoolClientService & RedisService & S3Service
const getHRef = ({ embed, length = "16", name, start = "0" }: NodeListParameters) => {
    const query = createQueryString({
        embed,
        length,
        name,
        start,
    })
    return `/nodes?${query}`
}
const getTotalFromDatabase = async (client: PoolClient, params: NodeListParameters) => {
    const builder = new QueryConfigBuilder()
    if (params?.name) {
        builder.add(
            "SELECT COUNT(node_uuid) AS total FROM node_name WHERE normalized=$::character varying AND build=$::bigint",
            [params.name, BUILD],
        )
    } else {
        builder.add('SELECT COUNT("uuid") AS total FROM node WHERE build=$::bigint', [BUILD])
    }
    const result = await client.query<{ total: string }>(builder.build())
    return parseInt(result.rows[0].total, 10)
}
const getUUIDsFromDatabase = (
    client: PoolClient,
    params: NodeListParameters,
    range?: { start: number; length: number },
) => {
    const builder = new QueryConfigBuilder()
    if (params?.name) {
        builder.add(
            `
SELECT node."uuid" FROM node_name
	LEFT JOIN node ON node_name.node_uuid = node."uuid" AND node_name.build = node.build
	WHERE node_name.normalized=$::character varying AND node_name.build=$::bigint
`,
            [params.name, BUILD],
        )
    } else {
        builder.add('SELECT "uuid" FROM node WHERE build=$::bigint', [BUILD])
    }
    builder.add("ORDER BY node.sort_index")
    if (range) {
        builder.add("OFFSET $ LIMIT $", [range.start, range.length])
    }
    return queryUUIDs(client, builder.build())
}
export const getNodes: Operation<GetNodesParameters, GetNodesService> = async (params, service) => {
    checkIfMatchBuild(params["if-match"])
    checkAccept(params.accept, DATA_MEDIA_TYPE)
    checkValidation(validateNodeListParameters(params), "Invalid attempt to load taxonomic group data.")
    const range = normalizeRange(params, node.userLabel)
    const href = getHRef(params)
    const [uuids, total] = await getCachedList({
        ...range,
        fallback: {
            all: client => getUUIDsFromDatabase(client, params),
            slice: client => getUUIDsFromDatabase(client, params, range),
            total: client => getTotalFromDatabase(client, params),
        },
        href,
        service,
    })
    return getJSONRange({
        ...params,
        ...range,
        href,
        s3Client: service.getS3Client(),
        total,
        type: node,
        uuids,
    })
}
export default getNodes
