import { DATA_MEDIA_TYPE, isResolveObjectsParameters, ResolveObjectsParameters, TitledLink } from "@phylopic/api-models"
import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import selectResolveLinkJSON from "../search/selectResolveLinkJSON"
import { PgClientService } from "../services/PgClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"

export type GetResolveObjectsParameters = DataRequestHeaders & Partial<ResolveObjectsParameters>

export type GetResolveObjectsService = PgClientService

const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."

const selectResolveLinkJSONFromObjectIDs = async (
    service: PgClientService,
    authority: Authority,
    namespace: Namespace,
    objectIDs: readonly ObjectID[],
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<string> => {
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
    for (const objectID of objectIDs) {
        try {
            return await selectResolveLinkJSON(service, authority, namespace, objectID, queryParameters)
        } catch (e) {
            if (e instanceof APIError && e.httpCode === 404) {
                continue
            }
            throw e
        }
    }
    throw new APIError(404, [
        {
            developerMessage: "Object could not be found.",
            field: "objectIDs",
            type: "RESOURCE_NOT_FOUND",
            userMessage: USER_MESSAGE,
        },
    ])
}

export const GetResolveObjects: Operation<GetResolveObjectsParameters, GetResolveObjectsService> = async (
    { accept, body: _body, ...queryAndPathParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isResolveObjectsParameters, USER_MESSAGE)
    const { authority, namespace, objectIDs, ...queryParameters } = queryAndPathParameters as ResolveObjectsParameters
    const path = `/resolve/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}`
    if (!queryParameters.build) {
        return createBuildRedirect(path, { ...queryParameters, objectIDs })
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const body = await selectResolveLinkJSONFromObjectIDs(
        service,
        authority,
        namespace,
        objectIDs.split(","),
        queryParameters,
    )
    const link = JSON.parse(body) as TitledLink
    return {
        body,
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href, true),
            "access-control-allow-methods": "OPTIONS,GET",
        },
        statusCode: 308,
    } as APIGatewayProxyResult
}

export default GetResolveObjects
