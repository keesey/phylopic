import { isUUID, ValidationFaultCollector } from "@phylopic/utils"
import { isNormalizedText, isUndefinedOr } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import NODE_EMBEDDED_PARAMETERS from "../constants/NODE_EMBEDDED_PARAMETERS"
import { NodeListParameters } from "../types/NodeListParameters"
import isListParameters from "./isListParameters"
export const isNodeListParameters = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeListParameters =>
    isListParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isUUID)((x as NodeListParameters).filter_collection, faultCollector?.sub("filter_collection")) &&
    isUndefinedOr(isNormalizedText)((x as NodeListParameters).filter_name, faultCollector?.sub("filter_name"))
export default isNodeListParameters
