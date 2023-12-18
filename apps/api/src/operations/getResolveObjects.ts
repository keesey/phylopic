import { DATA_MEDIA_TYPE, isResolveObjectsParameters, ResolveObjectsParameters, TitledLink } from "@phylopic/api-models"
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
import createBuildRedirect from "../build/createBuildRedirect"
const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."
export type GetResolveObjectsParameters = DataRequestHeaders & Partial<ResolveObjectsParameters>
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
                    field: "objectIDs",
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
    const link = await getRedirect(service, authority, namespace, objectIDs.split(","), queryParameters)
    return {
        body: stringifyNormalized(link),
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href, true),
            "access-control-allow-methods": "OPTIONS,GET",
        },
        statusCode: 308,
    } as APIGatewayProxyResult
}
export default GetResolveObjects
