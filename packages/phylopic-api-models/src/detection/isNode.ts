import { isArray, isNomen, isNormalizedText, isNullOr, isURL, ValidationFaultCollector } from "phylopic-utils/src"
import { Node } from "../types"
import isEntity from "./isEntity"
import isLink from "./isLink"
import isLinks from "./isLinks"
import isTitledLink from "./isTitledLink"
const isNodeLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node["_links"] =>
    isLinks(x, faultCollector) &&
    isArray(isLink(isNormalizedText))((x as Node["_links"]).childNodes, faultCollector?.sub("childNodes")) &&
    isNullOr(isLink(isNormalizedText))((x as Node["_links"]).cladeImages, faultCollector?.sub("cladeImages")) &&
    isArray(isTitledLink(isURL))((x as Node["_links"]).external, faultCollector?.sub("external")) &&
    isNullOr(isLink(isNormalizedText))((x as Node["_links"]).images, faultCollector?.sub("images")) &&
    isLink(isNormalizedText)((x as Node["_links"]).lineage, faultCollector?.sub("lineage")) &&
    isNullOr(isLink(isNormalizedText))((x as Node["_links"]).parentNode, faultCollector?.sub("parentNode")) &&
    isNullOr(isLink(isNormalizedText))((x as Node["_links"]).primaryImage, faultCollector?.sub("primaryImage"))
export const isNode = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node =>
    isEntity(x, isNodeLinks, faultCollector) && isArray(isNomen)((x as Node).names, faultCollector?.sub("names"))
export default isNode
