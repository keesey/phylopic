import {
    DATA_MEDIA_TYPE,
    EmbeddableParameters,
    EntityParameters,
    NODE_EMBEDDED_PARAMETERS,
    Node,
    NodeEmbedded,
    NodeLinks,
    isNode,
    isNodeParameters,
} from "@phylopic/api-models"
import { normalizeUUID, stringifyNormalized } from "@phylopic/utils"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import selectEntityJSONWithEmbedded from "../entities/selectEntityJSONWithEmbedded"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import createPermanentRedirect from "../results/createPermanentRedirect"
import getExternalLink from "../search/getExternalLink"
import { PgClientService } from "../services/PgClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
import { APIGatewayProxyResult } from "aws-lambda"
export type GetNodeParameters = DataRequestHeaders & Partial<EntityParameters<NodeEmbedded>>
export type GetNodeService = PgClientService
const USER_MESSAGE = "There was a problem with an attempt to load taxonomic data."
const isEmbeddedParameter = (x: unknown): x is string & keyof EmbeddableParameters<NodeEmbedded> =>
    NODE_EMBEDDED_PARAMETERS.includes(x as any)
export const getNode: Operation<GetNodeParameters, GetNodeService> = async (
    { accept, ...queryAndPathParameters },
    service: GetNodeService,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isNodeParameters, USER_MESSAGE)
    const { uuid, ...queryParameters } = queryAndPathParameters
    const normalizedUUID = normalizeUUID(uuid)
    const path = `/nodes/${encodeURIComponent(normalizedUUID)}`
    if (!queryParameters.build) {
        return createBuildRedirect(path, queryParameters)
    }
    if (uuid !== normalizedUUID) {
        return createPermanentRedirect(path, queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const embeds = Object.keys(queryParameters)
        .filter(isEmbeddedParameter)
        .map(key => key.slice("embed_".length) as string & keyof NodeEmbedded)
    const client = await service.createPgClient()
    let body: string
    let result: APIGatewayProxyResult
    try {
        body = await selectEntityJSONWithEmbedded<Node, NodeLinks>(
            client,
            "node",
            normalizedUUID,
            embeds,
            isNode,
            "taxonomic group",
        )
        if (body === "null") {
            const link = await getExternalLink(client, "phylopic.org", "nodes", normalizedUUID, queryParameters)
            result = {
                body: stringifyNormalized(link),
                headers: {
                    ...DATA_HEADERS,
                    ...createRedirectHeaders(link.href, true),
                },
                statusCode: 308,
            }
        } else {
            result = {
                body,
                headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
                statusCode: 200,
            }
        }
    } finally {
        await service.deletePgClient(client)
    }
    return result
}
export default getNode
