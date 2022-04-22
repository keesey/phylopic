import { isEntityParameters } from "phylopic-api-models/src"
import { NodeEmbedded } from "phylopic-api-models/src/types/NodeWithEmbedded"
import { ValidationFaultCollector } from "phylopic-utils/src"
import APIError from "../errors/APIError"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import { Operation } from "./Operation"
export interface GetRootNodeParameters {
    readonly build?: string
    readonly embed?: string
}
export const getRoot: Operation<GetRootNodeParameters> = async ({
    build,
    embed_childNodes,
    embed_parentNode,
    embed_primaryImage,
}) => {
    const faultCollector = new ValidationFaultCollector()
    if (!isEntityParameters<NodeEmbedded>({ embed_childNodes, embed_parentNode, embed_primaryImage }, faultCollector)) {
        throw new APIError()
    }
    checkValidation(isNodeParameters({ embed }), `Invalid attempt to load ${nodeType.userLabel} data.`)
    return {
        body: "",
        headers: createRedirectHeaders(
            `/nodes/${process.env.PHYLOPIC_ROOT_UUID}${embed ? `?embed=${encodeURIComponent(embed)}` : ""}`,
        ),
        statusCode: 307,
    }
}
export default getRoot
