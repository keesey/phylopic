import type { ValidationFaultCollector } from "@phylopic/utils"
import { isNormalizedText, isUndefinedOr } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded.js"
import NODE_EMBEDDED_PARAMETERS from "../constants/NODE_EMBEDDED_PARAMETERS.js"
import { NodeListParameters } from "../types/NodeListParameters.js"
import isListParameters from "./isListParameters.js"
export const isNodeListParameters = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeListParameters =>
    isListParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isNormalizedText)((x as NodeListParameters).filter_name, faultCollector?.sub("filter_name"))
export default isNodeListParameters
