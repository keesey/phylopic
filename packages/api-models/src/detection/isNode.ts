import type { ValidationFaultCollector } from "@phylopic/utils"
import { invalidate, isArray, isNomen, isNonnegativeNumber, isNormalizedText, isNullOr, isURL } from "@phylopic/utils"
import { type Node } from "../types/Node"
import isEntity from "./isEntity"
import isLink from "./isLink"
import isLinks from "./isLinks"
import isTitledLink from "./isTitledLink"
const isNodeAge = (x: unknown, faultCollector?: ValidationFaultCollector): x is NonNullable<Node["age"]> => {
    if (isArray(isNonnegativeNumber)(x, faultCollector)) {
        return x.length === 2 || invalidate(faultCollector, "Expected exactly two non-negative numbers.")
    }
    return false
}
const isNodeLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node["_links"] =>
    isLinks(x, isTitledLink(isNormalizedText), faultCollector) &&
    //isArray(isTitledLink(isNormalizedText))((x as Node["_links"]).ageSources, faultCollector?.sub("ageSources")) &&
    isArray(isTitledLink(isNormalizedText))((x as Node["_links"]).childNodes, faultCollector?.sub("childNodes")) &&
    isNullOr(isTitledLink(isNormalizedText))((x as Node["_links"]).cladeImages, faultCollector?.sub("cladeImages")) &&
    isArray(isTitledLink(isURL))((x as Node["_links"]).external, faultCollector?.sub("external")) &&
    isNullOr(isLink(isNormalizedText))((x as Node["_links"]).images, faultCollector?.sub("images")) &&
    isLink(isNormalizedText)((x as Node["_links"]).lineage, faultCollector?.sub("lineage")) &&
    isNullOr(isTitledLink(isNormalizedText))((x as Node["_links"]).parentNode, faultCollector?.sub("parentNode")) &&
    isNullOr(isTitledLink(isNormalizedText))((x as Node["_links"]).primaryImage, faultCollector?.sub("primaryImage"))
export const isNode = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node =>
    isEntity(x, isNodeLinks, faultCollector) &&
    //isNullOr(isNodeAge)((x as Node).age, faultCollector?.sub("age")) &&
    isArray(isNomen)((x as Node).names, faultCollector?.sub("names"))
export default isNode
