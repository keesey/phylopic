import { DATA_MEDIA_TYPE, isResolveObjectsParameters, ResolveObjectsParameters, TitledLink } from "@phylopic/api-models"
import { Authority, createSearch, Namespace, ObjectID, stringifyNormalized, UUID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import ENTITY_JSON_SOURCE from "../entities/ENTITY_JSON_SOURCE"
import selectResolveObjectJSON from "../entities/selectResolveObjectJSON"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import { PgClientService } from "../services/PgClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"

export type GetResolveObjectsParameters = DataRequestHeaders & Partial<ResolveObjectsParameters>
export type GetResolveObjectsService = PgClientService

const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."

const selectResolveLinkJSONFromPostgres = async (
    service: PgClientService,
    authority: Authority,
    namespace: Namespace,
    objectIDs: readonly ObjectID[],
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<string> => {
    const client = await service.createPgClient()
    try {
        const result = await client.query<{ node_uuid: UUID; title: string | null }>(
            'SELECT node_uuid,title FROM node_external WHERE authority=$1::character varying AND "namespace"=$2::character varying AND objectid=ANY($3::character varying[]) AND build=$4::bigint ORDER BY array_position($3::character varying[],objectid) LIMIT 1',
            [authority, namespace, objectIDs, BUILD],
        )
        if (result.rowCount !== 1) {
            throw new APIError(404, [
                {
                    developerMessage: "Object could not be found. None of the IDs matched.",
                    field: "objectIDs",
                    type: "RESOURCE_NOT_FOUND",
                    userMessage: USER_MESSAGE,
                },
            ])
        }
        return stringifyNormalized({
            href: `/nodes/${encodeURIComponent(result.rows[0].node_uuid)}${createSearch(queryParameters)}`,
            title: result.rows[0].title ?? "",
        })
    } finally {
        await service.deletePgClient(client)
    }
}

const selectResolveLinkJSON = async (
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
    if (ENTITY_JSON_SOURCE !== "postgres") {
        for (const objectID of objectIDs) {
            const body = await selectResolveObjectJSON(authority, namespace, objectID)
            if (body !== null) {
                return body
            }
        }
        if (ENTITY_JSON_SOURCE === "s3") {
            console.warn("Resolve JSON is missing from S3; falling back to Postgres.", { authority, namespace })
        }
    }
    return selectResolveLinkJSONFromPostgres(service, authority, namespace, objectIDs, queryParameters)
}

export const GetResolveObjects: Operation<GetResolveObjectsParameters, GetResolveObjectsService> = async (
    { accept, body, ...queryAndPathParameters },
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
    const body = await selectResolveLinkJSON(
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
