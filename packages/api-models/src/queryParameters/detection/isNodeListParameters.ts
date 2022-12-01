import { isUUIDish, ValidationFaultCollector } from "@phylopic/utils"
import { isNormalizedText, isUndefinedOr } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import NODE_EMBEDDED_PARAMETERS from "../constants/NODE_EMBEDDED_PARAMETERS"
import { NodeListParameters } from "../types/NodeListParameters"
import hasOnlyOne from "./hasOnlyOne"
import isListParameters from "./isListParameters"
export const isNodeListParameters = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeListParameters =>
    isListParameters<NodeEmbedded>(NODE_EMBEDDED_PARAMETERS)(x, faultCollector) &&
    isUndefinedOr(isUUIDish)((x as NodeListParameters).filter_collection, faultCollector?.sub("filter_collection")) &&
    isUndefinedOr(isNormalizedText)((x as NodeListParameters).filter_name, faultCollector?.sub("filter_name")) &&
    hasOnlyOne<NodeListParameters>(x, ["filter_collection", "filter_name"], faultCollector)
export default isNodeListParameters
