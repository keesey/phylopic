import { isArray, isNullOr, isObject, isUndefinedOr, type ValidationFaultCollector } from "@phylopic/utils"
import { type ImageEmbedded, type ImageWithEmbedded } from "../types/ImageWithEmbedded"
import { isImage } from "./isImage"
import { isNode } from "./isNode"
const isImageEmbedded = (x: unknown, faultCollector?: ValidationFaultCollector): x is ImageEmbedded =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isNullOr(isNode))((x as ImageEmbedded).generalNode, faultCollector?.sub("generalNode")) &&
    isUndefinedOr(isArray(isNode))((x as ImageEmbedded).nodes, faultCollector?.sub("nodes")) &&
    isUndefinedOr(isNode)((x as ImageEmbedded).specificNode, faultCollector?.sub("specificNode"))
export const isImageWithEmbedded = (x: unknown, faultCollector?: ValidationFaultCollector): x is ImageWithEmbedded =>
    isImage(x, faultCollector) && isImageEmbedded((x as ImageWithEmbedded)._embedded, faultCollector?.sub("_embedded"))
