import type { ValidationFaultCollector } from "@phylopic/utils"
import { isArray, isNullOr, isObject, isUndefinedOr } from "@phylopic/utils"
import { NodeWithEmbedded } from "../types/NodeWithEmbedded.js"
import { NodeEmbedded } from "../types/NodeWithEmbedded.js"
import isImage from "./isImage.js"
import isNode from "./isNode.js"
const isNodeEmbedded = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeEmbedded =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isArray(isNode))((x as NodeEmbedded).childNodes, faultCollector?.sub("childNodes")) &&
    isUndefinedOr(isNullOr(isNode))((x as NodeEmbedded).parentNode, faultCollector?.sub("parentNode")) &&
    isUndefinedOr(isNullOr(isImage))((x as NodeEmbedded).primaryImage, faultCollector?.sub("primaryImage"))
export const isNodeWithEmbedded = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeWithEmbedded =>
    isNode(x, faultCollector) && isNodeEmbedded((x as NodeWithEmbedded)._embedded, faultCollector?.sub("_embedded"))
export default isNodeWithEmbedded
