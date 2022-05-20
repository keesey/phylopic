import type { ValidationFaultCollector } from "@phylopic/utils"
import { isNonnegativeInteger, isNormalizedText, isNullOr, isPositiveInteger } from "@phylopic/utils"
import { List } from "../types/List"
import isData from "./isData"
import isLink from "./isLink"
import isLinks from "./isLinks"
const isListLinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is List["_links"] =>
    isLinks(x) &&
    isNullOr(isLink(isNormalizedText))((x as List["_links"]).firstPage, faultCollector?.sub("firstPage")) &&
    isNullOr(isLink(isNormalizedText))((x as List["_links"]).lastPage, faultCollector?.sub("lastPage"))
export const isList = (x: unknown, faultCollector?: ValidationFaultCollector): x is List =>
    isData(x, faultCollector) &&
    isListLinks((x as List)._links, faultCollector?.sub("_links")) &&
    isPositiveInteger((x as List).itemsPerPage, faultCollector?.sub("itemsPerPage")) &&
    isNonnegativeInteger((x as List).totalItems, faultCollector?.sub("totalItems")) &&
    isNonnegativeInteger((x as List).totalPages, faultCollector?.sub("totalPages"))
export default isList
