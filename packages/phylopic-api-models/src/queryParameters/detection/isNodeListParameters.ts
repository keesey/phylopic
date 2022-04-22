import { isNormalizedText, isUndefinedOr, ValidationFaultCollector } from "phylopic-utils/src"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import NODE_EMBEDDED_PARAMETERS from "../constants/NODE_EMBEDDED_PARAMETERS"
import { NodeListParameters } from "../types"
import isListParameters from "./isListParameters"
export const isNodeListParameters = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeListParameters =>
    isListParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isNormalizedText)((x as NodeListParameters).name, faultCollector?.sub("name"))
export default isNodeListParameters
