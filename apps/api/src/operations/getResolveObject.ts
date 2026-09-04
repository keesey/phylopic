import { DATA_MEDIA_TYPE, isResolveObjectParameters, ResolveObjectParameters, TitledLink } from "@phylopic/api-models"
import { Authority, Namespace, ObjectID, stringifyNormalized } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import ENTITY_JSON_SOURCE from "../entities/ENTITY_JSON_SOURCE"
import selectResolveObjectJSON from "../entities/selectResolveObjectJSON"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import getExternalLink from "../search/getExternalLink"
import mergeResolveLinkQuery from "../search/mergeResolveLinkQuery"
import { PgClientService } from "../services/PgClientService"
import type { S3ClientService } from "../services/S3ClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"

export type GetResolveObjectParameters = DataRequestHeaders & Partial<ResolveObjectParameters>
export type GetResolveObjectsService = PgClientService & S3ClientService

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

const selectResolveLinkJSONFromPostgres = async (
    service: PgClientService,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<string> => {
    const client = await service.createPgClient()
    try {
        const link = await getExternalLink(client, authority, namespace, objectID, queryParameters)
        return stringifyNormalized(link)
    } finally {
        await service.deletePgClient(client)
    }
}

const selectResolveLinkJSON = async (
    service: PgClientService & S3ClientService,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<string> => {
    if (ENTITY_JSON_SOURCE !== "postgres") {
        const body = await selectResolveObjectJSON(service, authority, namespace, objectID)
        if (body !== null) {
            return mergeResolveLinkQuery(body, queryParameters)
        }
        if (ENTITY_JSON_SOURCE === "s3") {
            console.warn("Resolve JSON is missing from S3; falling back to Postgres.", {
                authority,
                namespace,
                objectID,
            })
        }
    }
    return selectResolveLinkJSONFromPostgres(service, authority, namespace, objectID, queryParameters)
}

export const getResolveObject: Operation<GetResolveObjectParameters, GetResolveObjectsService> = async (
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
