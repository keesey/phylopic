import { ValidationFaultCollector } from "phylopic-utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import NODE_EMBEDDED_PARAMETERS from "../constants/NODE_EMBEDDED_PARAMETERS"
import { NodeLineageParameters } from "../types"
import isListParameters from "./isListParameters"
export const isNodeLineageParameters = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is NodeLineageParameters => isListParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector)
export default isNodeLineageParameters
