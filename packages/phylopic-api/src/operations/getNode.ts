import {
    EmbeddableParameters,
    EntityParameters,
    isEntityParameters,
    isNode,
    Node,
    NodeEmbedded,
    NodeLinks,
    NODE_EMBEDDED_PARAMETERS,
} from "phylopic-api-models/src"
import { normalizeUUID, UUID } from "phylopic-utils/src"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import selectEntityJSONWithEmbedded from "../entities/selectEntityJSONWithEmbedded"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import STANDARD_HEADERS from "../headers/responses/STANDARD_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { PoolClientService } from "../services/PoolClientService"
import create304 from "../utils/aws/create304"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetNodeParameters = DataRequestHeaders & Partial<EntityParameters<NodeEmbedded>>
export type GetNodeService = PoolClientService
const USER_MESSAGE = "There was a problem with an attempt to load taxonomic data."
const isEmbeddedParameter = (x: unknown): x is string & keyof EmbeddableParameters<NodeEmbedded> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    NODE_EMBEDDED_PARAMETERS.includes(x as any)
export const getNode: Operation<GetNodeParameters, GetNodeService> = async (
    { accept, "if-none-match": ifNoneMatch, ...queryParameters },
    service: GetNodeService,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    validate(queryParameters, isEntityParameters(NODE_EMBEDDED_PARAMETERS), USER_MESSAGE)
    const uuid = normalizeUUID(queryParameters.uuid as UUID)
    if (!queryParameters.build) {
        return createBuildRedirect(`/node/${encodeURIComponent(uuid)}`, queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const embeds = Object.keys(queryParameters)
        .filter(isEmbeddedParameter)
        .map(key => key.slice("embed_".length) as string & keyof NodeEmbedded)
    const client = await service.getPoolClient()
    let body: string
    try {
        body = await selectEntityJSONWithEmbedded<Node, NodeLinks>(
            client,
            "node",
            uuid,
            embeds,
            isNode,
            "taxonomic node",
        )
    } finally {
        client.release()
    }
    return {
        body,
        headers: STANDARD_HEADERS,
        statusCode: 200,
    }
}
export default getNode
