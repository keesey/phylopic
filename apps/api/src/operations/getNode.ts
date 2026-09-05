import {
    DATA_MEDIA_TYPE,
    EmbeddableParameters,
    EntityParameters,
    NODE_EMBEDDED_PARAMETERS,
    Node,
    NodeEmbedded,
    NodeLinks,
    TitledLink,
    isNode,
    isNodeParameters,
} from "@phylopic/api-models"
import { normalizeUUID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import selectEntityJSONWithEmbedded from "../entities/selectEntityJSONWithEmbedded"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import createPermanentRedirect from "../results/createPermanentRedirect"
import selectResolveLinkJSON from "../search/selectResolveLinkJSON"
import type { S3ClientService } from "../services/S3ClientService"
import withS3Client from "../services/withS3Client"
import validate from "../validation/validate"
import { Operation } from "./Operation"

export type GetNodeParameters = DataRequestHeaders & Partial<EntityParameters<NodeEmbedded>>
export type GetNodeService = S3ClientService

const USER_MESSAGE = "There was a problem with an attempt to load taxonomic data."
const isEmbeddedParameter = (x: unknown): x is string & keyof EmbeddableParameters<NodeEmbedded> =>
    NODE_EMBEDDED_PARAMETERS.includes(x as any)

export const getNode: Operation<GetNodeParameters, GetNodeService> = async (
    { accept, ...queryAndPathParameters },
    service,
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
    const body = await withS3Client(service, client =>
        selectEntityJSONWithEmbedded<Node, NodeLinks>(
            client,
            "nodes",
            normalizedUUID,
            embeds,
            isNode,
            "taxonomic group",
        ),
    )
    if (body === "null") {
        const redirectBody = await selectResolveLinkJSON(service, "phylopic.org", "nodes", normalizedUUID, {
            ...queryParameters,
            build: BUILD,
        })
        const link = JSON.parse(redirectBody) as TitledLink
        return {
            body: redirectBody,
            headers: {
                ...DATA_HEADERS,
                ...createRedirectHeaders(link.href, true),
            },
            statusCode: 308,
        }
    }
    return {
        body,
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}

export default getNode
