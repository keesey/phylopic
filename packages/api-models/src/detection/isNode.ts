import { isArray, isNomen, isNormalizedText, isNullOr, isURL, type ValidationFaultCollector } from "@phylopic/utils"
import { Node } from "../types/Node"
import { isEntity } from "./isEntity"
import { isLink } from "./isLink"
import { isLinks } from "./isLinks"
import { isTitledLink } from "./isTitledLink"
const isNodeLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node["_links"] =>
    isLinks(x, isTitledLink(isNormalizedText), faultCollector) &&
    isArray(isTitledLink(isNormalizedText))((x as Node["_links"]).childNodes, faultCollector?.sub("childNodes")) &&
    isNullOr(isTitledLink(isNormalizedText))((x as Node["_links"]).cladeImages, faultCollector?.sub("cladeImages")) &&
    isArray(isTitledLink(isURL))((x as Node["_links"]).external, faultCollector?.sub("external")) &&
    isNullOr(isLink(isNormalizedText))((x as Node["_links"]).images, faultCollector?.sub("images")) &&
    // :TODO: Reinstate this after launching the update to the API
    //isLink(isNormalizedText)((x as Node["_links"]).imageTags, faultCollector?.sub("imageTags")) &&
    isLink(isNormalizedText)((x as Node["_links"]).lineage, faultCollector?.sub("lineage")) &&
    isNullOr(isTitledLink(isNormalizedText))((x as Node["_links"]).parentNode, faultCollector?.sub("parentNode")) &&
    isNullOr(isTitledLink(isNormalizedText))((x as Node["_links"]).primaryImage, faultCollector?.sub("primaryImage"))
export const isNode = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node =>
    isEntity(x, isNodeLinks, faultCollector) && isArray(isNomen)((x as Node).names, faultCollector?.sub("names"))
