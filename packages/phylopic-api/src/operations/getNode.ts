import { APIGatewayProxyResult } from "aws-lambda"
import { TitledLink, UUID, validateNodeParameters } from "phylopic-api-types"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import { EntityParameters } from "../entities/EntityParameters"
import getEntityJSON from "../entities/get"
import nodeType from "../entities/node"
import APIError from "../errors/APIError"
import createRedirectHeaders from "../headers/createRedirectHeaders"
import DATA_HEADERS from "../headers/DATA_HEADERS"
import STANDARD_HEADERS from "../headers/STANDARD_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { PoolService } from "../services/PoolService"
import { S3Service } from "../services/S3Service"
import create304 from "../utils/aws/create304"
import normalizeUUIDv4 from "../utils/uuid/normalizeUUIDv4"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export interface GetNodeParameters extends EntityParameters {
    readonly uuid?: string
}
export type GetNodeService = S3Service & PoolService
const USER_MESSAGE = "There was a problem with an attempt to load taxonomic group data."
export const getNode: Operation<GetNodeParameters, GetNodeService> = async (
    { accept, build, embed, "if-none-match": ifNoneMatch, uuid },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    uuid = normalizeUUIDv4(uuid, nodeType.userLabel)
    checkValidation(validateNodeParameters({ embed }), USER_MESSAGE)
    if (!build) {
        return createBuildRedirect(`/nodes/${encodeURIComponent(uuid)}`, embed ? { embed } : {})
    }
    checkBuild(build, USER_MESSAGE)
    const s3Client = service.getS3Client()
    let result: APIGatewayProxyResult
    try {
        const body = await getEntityJSON(s3Client, embed, uuid, nodeType)
        result = {
            body,
            headers: STANDARD_HEADERS,
            statusCode: 200,
        }
    } catch (e) {
        if (e instanceof APIError && e.httpCode === 404) {
            const pgClient = await service.getPoolClient()
            try {
                const queryResult = await pgClient.query<{ node_uuid: UUID; title: string | null }>(
                    'SELECT node_uuid,title FROM node_external WHERE authority=$1::character varying AND "namespace"=$2::character varying AND objectid=$3::character varying AND build=$4::bigint LIMIT 1',
                    ["phylopic.org", "nodes", uuid, BUILD],
                )
                const link: TitledLink = {
                    href: "/nodes/" + encodeURIComponent(queryResult.rows[0].node_uuid),
                    title: queryResult.rows[0].title ?? "",
                }
                if (queryResult.rowCount === 1) {
                    const location = link.href + `?build=${BUILD}${embed ? `&embed=${encodeURIComponent(embed)}` : ""}`
                    result = {
                        body: JSON.stringify(link),
                        headers: {
                            ...DATA_HEADERS,
                            ...createRedirectHeaders(location),
                        },
                        statusCode: 307,
                    }
                } else {
                    throw e
                }
            } finally {
                pgClient.release()
            }
        } else {
            throw e
        }
    } finally {
        s3Client.destroy()
    }
    return result
}
export default getNode
