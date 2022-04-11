import { isNonnegativeInteger, isString } from "phylopic-utils/src/types"
import { Page } from "../types"
import isData from "./isData"
import isLink from "./isLink"
import isLinkArray from "./isLinkArray"
import isLinkOrNull from "./isLinkOrNull"
import isLinks from "./isLinks"
const isPageLinks = (x: unknown): x is Page["_links"] =>
    isLinks(x) &&
    isLinkArray((x as Page["_links"]).items, isString) &&
    isLink((x as Page["_links"]).list, isString) &&
    isLinkOrNull((x as Page["_links"]).next, isString) &&
    isLinkOrNull((x as Page["_links"]).previous, isString)
export const isPage = (x: unknown): x is Page =>
    isData(x) && isPageLinks((x as Page)._links) && isNonnegativeInteger((x as Page).index)
export default isPage
