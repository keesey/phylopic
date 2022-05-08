import { DATA_MEDIA_TYPE, isResolveParameters, ResolveParameters, TitledLink } from "@phylopic/api-models"
import { Authority, Namespace, ObjectID, stringifyNormalized } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import getExternalLink from "../search/getExternalLink"
import { PoolClientService } from "../services/PoolClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetResolveObjectParameters = DataRequestHeaders & Partial<ResolveParameters>
export type GetResolveObjectsService = PoolClientService
const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."
const getRedirectLink = async (
    service: PoolClientService,
    authority: Authority | undefined,
    namespace: Namespace | undefined,
    objectID: ObjectID | undefined,
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<TitledLink> => {
    if (!authority || !namespace || !objectID) {
        throw new APIError(400, [
            {
                developerMessage: "Not enough information to resolve.",
                field: authority ? (namespace ? "objectID" : "namespace") : "authority",
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
    let result: TitledLink
    try {
        result = await getExternalLink(client, authority, namespace, objectID, queryParameters)
    } finally {
        client.release()
    }
    return result
}
export const getResolveObject: Operation<GetResolveObjectParameters, GetResolveObjectsService> = async (
    { accept, ...queryAndPathParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isResolveParameters, USER_MESSAGE)
    const { authority, namespace, objectID, ...queryParameters } = queryAndPathParameters as ResolveParameters
    if (queryParameters.build) {
        checkBuild(queryParameters.build, USER_MESSAGE)
    }
    const link = await getRedirectLink(service, authority, namespace, objectID, { ...queryParameters, build: BUILD })
    const permanent = queryParameters.build === BUILD.toString(10)
    return {
        body: stringifyNormalized(link),
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href, permanent),
        },
        statusCode: permanent ? 308 : 307,
    } as APIGatewayProxyResult
}
export default getResolveObject
