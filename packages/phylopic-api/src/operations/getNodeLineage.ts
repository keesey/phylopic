import { PoolClient } from "pg"
import { ListParameters, validateNodeListParameters } from "phylopic-api-types"
import BUILD from "../build/BUILD"
import getJSONRange from "../entities/getJSONRange"
import node from "../entities/node"
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
import normalizeUUIDv4 from "../utils/uuid/normalizeUUIDv4"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export interface GetNodeLineageParameters extends Partial<ListParameters> {
    accept?: string
    "if-none-match"?: string
    "if-match"?: string
    uuid?: string
}
export type GetNodeLineageService = PoolService & RedisService & S3Service
const getHRef = (uuid: string, { embed }: Pick<GetNodeLineageParameters, "embed">) => {
    const query = createQueryString({ embed })
    return `/nodes/${encodeURIComponent(uuid)}/lineage${query ? `?${query}` : ""}`
}
const getUUIDsFromDatabase = (client: PoolClient, nodeUUID: string) => {
    const queryBuilder = new QueryConfigBuilder(
        `
WITH RECURSIVE predecessors AS (
    SELECT "uuid", parent_uuid, build, 0 as lineage_index
        FROM node
        WHERE "uuid"=$::uuid AND build=$::bigint
    UNION
    SELECT n."uuid", n.parent_uuid, n.build, suc.lineage_index + 1
        FROM node n
        INNER JOIN predecessors suc ON suc.parent_uuid = n."uuid" AND suc.build = n.build
)
SELECT "uuid" FROM predecessors
GROUP BY "uuid", lineage_index
ORDER BY lineage_index
`,
        [nodeUUID, BUILD],
    )
    return queryUUIDs(client, queryBuilder.build())
}
export const getLineage: Operation<GetNodeLineageParameters, GetNodeLineageService> = async (params, service) => {
    if (matchesBuildETag(params["if-none-match"])) {
        return create304()
    }
    checkIfMatchBuild(params["if-match"])
    checkAccept(params.accept, DATA_MEDIA_TYPE)
    checkValidation(validateNodeListParameters(params), "Invalid attempt to load taxonomic group data.")
    const uuid = normalizeUUIDv4(params.uuid, node.userLabel)
    const range = normalizeRange(params, node.userLabel)
    const href = getHRef(uuid, params)
    const [uuids, total] = await getCachedList({
        ...range,
        fallback: { all: client => getUUIDsFromDatabase(client, uuid) },
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
export default getLineage
