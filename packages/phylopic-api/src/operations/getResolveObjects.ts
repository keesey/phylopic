import { APIGatewayProxyResult } from "aws-lambda"
import isResolveParameters from "phylopic-api-models/dist/queryParameters/detection/isResolveParameters"
import { ResolveParameters } from "phylopic-api-models/dist/queryParameters/types/ResolveParameters"
import { TitledLink } from "phylopic-api-models/dist/types/TitledLink"
import createSearch from "phylopic-utils/dist/http/createSearch"
import { Authority } from "phylopic-utils/dist/models/types/Authority"
import { Namespace } from "phylopic-utils/dist/models/types/Namespace"
import { ObjectID } from "phylopic-utils/dist/models/types/ObjectID"
import { UUID } from "phylopic-utils/dist/models/types/UUID"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { PoolClientService } from "../services/PoolClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."
export type GetResolveObjectsParameters = DataRequestHeaders &
    Partial<Omit<ResolveParameters, "objectID">> & {
        readonly body?: string
    }
export type GetResolveObjectsService = PoolClientService
const getRedirect = async (
    service: PoolClientService,
    authority: Authority | undefined,
    namespace: Namespace | undefined,
    objectIDs: ObjectID[],
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<TitledLink> => {
    if (!authority || !namespace) {
        throw new APIError(400, [
            {
                developerMessage: "Not enough information to resolve.",
                field: authority ? "namespace" : "authority",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    if (authority === "phylopic.org") {
        throw new APIError(400, [
            {
                developerMessage: "This method is not meant to be used for PhyloPic objects.",
                field: "authority",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    const client = await service.getPoolClient()
    let link: TitledLink
    try {
        const result = await client.query<{ node_uuid: UUID; title: string | null }>(
            'SELECT node_uuid,title FROM node_external WHERE authority=$1::character varying AND "namespace"=$2::character varying AND objectid=ANY($3::character varying[]) AND build=$4::bigint ORDER BY array_position($3::character varying[],objectid) LIMIT 1',
            [authority, namespace, objectIDs, BUILD],
        )
        if (result.rowCount !== 1) {
            throw new APIError(404, [
                {
                    developerMessage: "Object could not be found. None of the IDs matched.",
                    field: "body",
                    type: "RESOURCE_NOT_FOUND",
                    userMessage: USER_MESSAGE,
                },
            ])
        }
        link = {
            href: `/nodes/` + encodeURIComponent(result.rows[0].node_uuid) + createSearch(queryParameters),
            title: result.rows[0].title ?? "",
        }
    } finally {
        client.release()
    }
    return link
}
const getObjectIDsFromBody = (body: string | null) => {
    if (!body) {
        throw new APIError(400, [
            {
                developerMessage: "Missing body.",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    let objectIDs: ObjectID[]
    try {
        objectIDs = JSON.parse(body)
    } catch (e) {
        throw new APIError(400, [
            {
                developerMessage: "Invalid JSON in body",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    if (!Array.isArray(objectIDs) || !objectIDs.every(item => typeof item === "string" && item.length > 0)) {
        throw new APIError(400, [
            {
                developerMessage: "Expected body to be an array of nonempty strings.",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    return objectIDs
}
export const getResolveObjects: Operation<GetResolveObjectsParameters, GetResolveObjectsService> = async (
    { accept, body, ...queryAndPathParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate({ ...queryAndPathParameters, objectID: "-" }, isResolveParameters, USER_MESSAGE)
    if (!body) {
        throw new APIError(400, [
            {
                developerMessage: "Missing body.",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    const objectIDs = getObjectIDsFromBody(body)
    const { authority, namespace, ...queryParameters } = queryAndPathParameters
    if (queryParameters.build) {
        checkBuild(queryParameters.build, USER_MESSAGE)
    }
    const link = await getRedirect(service, authority, namespace, objectIDs, queryParameters)
    return {
        body: JSON.stringify(link),
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href, false),
            "access-control-allow-methods": "OPTIONS,POST",
        },
        statusCode: 303,
    } as APIGatewayProxyResult
}
export default getResolveObjects
