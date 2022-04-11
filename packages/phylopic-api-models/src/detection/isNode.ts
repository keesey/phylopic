import { isNomen } from "phylopic-utils/src/models"
import isURL from "phylopic-utils/src/models/detection/isURL"
import { isString } from "phylopic-utils/src/types"
import { Node } from "../types"
import isEntity from "./isEntity"
import isLink from "./isLink"
import isLinkArray from "./isLinkArray"
import isLinkOrNull from "./isLinkOrNull"
import isLinks from "./isLinks"
import isTitledLinkArray from "./isTitledLinkArray"
const isNodeLinks = (x: unknown): x is Node["_links"] =>
    isLinks(x) &&
    isLinkArray((x as Node["_links"]).childNodes, isString) &&
    isLinkOrNull((x as Node["_links"]).cladeImages, isString) &&
    isTitledLinkArray((x as Node["_links"]).external, isURL) &&
    isLinkOrNull((x as Node["_links"]).images, isString) &&
    isLink((x as Node["_links"]).lineage, isString) &&
    isLinkOrNull((x as Node["_links"]).parentNode, isString) &&
    isLinkOrNull((x as Node["_links"]).primaryImage, isString)
export const isNode = (x: unknown): x is Node =>
    isEntity(x, isNodeLinks) &&
    Array.isArray((x as Node).names) &&
    (x as Node).names.length >= 1 &&
    (x as Node).names.every(isNomen)
export default isNode
