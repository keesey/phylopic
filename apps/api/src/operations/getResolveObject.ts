import { DATA_MEDIA_TYPE, isResolveObjectParameters, ResolveObjectParameters, TitledLink } from "@phylopic/api-models"
import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import selectResolveLinkJSON from "../search/selectResolveLinkJSON"
import type { S3ClientService } from "../services/S3ClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"

export type GetResolveObjectParameters = DataRequestHeaders & Partial<ResolveObjectParameters>
export type GetResolveObjectService = S3ClientService

const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."

const assertResolvable = (
    authority: Authority | undefined,
    namespace: Namespace | undefined,
    objectID: ObjectID | undefined,
) => {
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
}

export const getResolveObject: Operation<GetResolveObjectParameters, GetResolveObjectService> = async (
    { accept, ...queryAndPathParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isResolveObjectParameters, USER_MESSAGE)
    const { authority, namespace, objectID, ...queryParameters } = queryAndPathParameters as ResolveObjectParameters
    if (queryParameters.build) {
        checkBuild(queryParameters.build, USER_MESSAGE)
    }
    assertResolvable(authority, namespace, objectID)
    const body = await selectResolveLinkJSON(service, authority, namespace, objectID, {
        ...queryParameters,
        build: BUILD,
    })
    const link = JSON.parse(body) as TitledLink
    const permanent = queryParameters.build === BUILD.toString(10)
    return {
        body,
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href, permanent),
        },
        statusCode: permanent ? 308 : 307,
    } as APIGatewayProxyResult
}

export default getResolveObject
