import { NodeEmbedded } from "../models"
import { NodeListParameters } from "../queryParameters"
import { validateListParameters } from "./validateListParameters"
import validateQueryText from "./validateQueryText"
import VALID_NODE_EMBEDS from "./VALID_NODE_EMBEDS"
export const validateNodeListParameters = (parameters: NodeListParameters) => {
    return [
        ...validateListParameters<NodeEmbedded>(parameters, VALID_NODE_EMBEDS),
        ...(parameters.name ? validateQueryText(parameters.name, "name") : []),
    ]
}
export default validateNodeListParameters
