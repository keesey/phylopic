import { DATA_MEDIA_TYPE, isResolveParameters, ResolveParameters, TitledLink } from "@phylopic/api-models"
import { Authority, createSearch, Namespace, ObjectID, stringifyNormalized, UUID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import { PgClientService } from "../services/PgClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."
export type GetResolveObjectsParameters = DataRequestHeaders &
    Partial<Omit<ResolveParameters, "objectID">> & {
        readonly body?: string
    }
export type GetResolveObjectsService = PgClientService
const getRedirect = async (
    service: PgClientService,
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
    const client = await service.createPgClient()
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
        await service.deletePgClient(client)
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
export const postResolveObjects: Operation<GetResolveObjectsParameters, GetResolveObjectsService> = async (
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
        body: stringifyNormalized(link),
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href, false),
            "access-control-allow-methods": "OPTIONS,POST",
        },
        statusCode: 303,
    } as APIGatewayProxyResult
}
export default postResolveObjects
