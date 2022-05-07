import { isArray, isNonnegativeInteger, isNormalizedText, isNullOr, ValidationFaultCollector } from "@phylopic/utils"
import { Page } from "../types/Page"
import isData from "./isData"
import isLink from "./isLink"
import isLinks from "./isLinks"
const isPageLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is Page["_links"] =>
    isLinks(x, faultCollector) &&
    isArray(isLink(isNormalizedText))((x as Page["_links"]).items, faultCollector?.sub("items")) &&
    isLink(isNormalizedText)((x as Page["_links"]).list, faultCollector?.sub("list")) &&
    isNullOr(isLink(isNormalizedText))((x as Page["_links"]).next, faultCollector?.sub("next")) &&
    isNullOr(isLink(isNormalizedText))((x as Page["_links"]).previous, faultCollector?.sub("previous"))
export const isPage = (x: unknown, faultCollector?: ValidationFaultCollector): x is Page =>
    isData(x, faultCollector) &&
    isPageLinks((x as Page)._links, faultCollector?.sub("_links")) &&
    isNonnegativeInteger((x as Page).index, faultCollector?.sub("index"))
export default isPage
