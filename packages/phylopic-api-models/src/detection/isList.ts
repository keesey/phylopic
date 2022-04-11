import { isNonnegativeInteger, isPositiveInteger, isString } from "phylopic-utils/src/types"
import { List } from "../types"
import isData from "./isData"
import isLinkOrNull from "./isLinkOrNull"
import isLinks from "./isLinks"
const isListLinks = (x: unknown): x is List["_links"] =>
    isLinks(x) &&
    isLinkOrNull((x as List["_links"]).firstPage, isString) &&
    isLinkOrNull((x as List["_links"]).lastPage, isString)
export const isList = (x: unknown): x is List =>
    isData(x) &&
    isListLinks((x as List)._links) &&
    isPositiveInteger((x as List).itemsPerPage) &&
    isNonnegativeInteger((x as List).totalItems) &&
    isNonnegativeInteger((x as List).totalPages)
export default isList
