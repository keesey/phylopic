import { DATA_MEDIA_TYPE, isResolveObjectsParameters, ResolveObjectsParameters, TitledLink } from "@phylopic/api-models"
import { Authority, createSearch, Namespace, ObjectID, stringifyNormalized, UUID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { getResolveJSONKey } from "@phylopic/s3-entities"
import selectJSONFromS3Entities from "../entities/selectJSONFromS3Entities"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import mergeResolveLinkQuery from "../search/mergeResolveLinkQuery"
import { PgClientService } from "../services/PgClientService"
import type { S3ClientService } from "../services/S3ClientService"
import withPgClient from "../services/withPgClient"
import withS3Client from "../services/withS3Client"
import validate from "../validation/validate"
import { Operation } from "./Operation"

export type GetResolveObjectsParameters = DataRequestHeaders & Partial<ResolveObjectsParameters>
export type GetResolveObjectsService = PgClientService & S3ClientService

const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."

const selectResolveLinkJSONFromPostgres = async (
    service: PgClientService,
    authority: Authority,
    namespace: Namespace,
    objectIDs: readonly ObjectID[],
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<string> =>
    withPgClient(service, async client => {
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
    })

const selectResolveLinkJSON = async (
    service: PgClientService & S3ClientService,
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
    const s3Body = await withS3Client(service, async client => {
        for (const objectID of objectIDs) {
            const body = await selectJSONFromS3Entities(
                client,
                getResolveJSONKey(BUILD, authority, namespace, objectID),
            )
            if (body !== null) {
                return mergeResolveLinkQuery(body, queryParameters)
            }
        }
        return null
    })
    if (s3Body !== null) {
        return s3Body
    }
    console.warn("Resolve JSON is missing from S3; falling back to Postgres.", { authority, namespace })
    return selectResolveLinkJSONFromPostgres(service, authority, namespace, objectIDs, queryParameters)
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
    const body = await selectResolveLinkJSON(service, authority, namespace, objectIDs.split(","), queryParameters)
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
