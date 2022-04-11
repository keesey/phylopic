import { isISOTimestamp, isNormalizedText } from "phylopic-utils/src/models"
import { isPositiveInteger, isString } from "phylopic-utils/src/types"
import { API } from "../types"
import isLink from "./isLink"
import isLinks from "./isLinks"
import isTitledLink from "./isTitledLink"
const isAPILinks = (x: unknown): x is API["_links"] =>
    isLinks(x) &&
    isTitledLink((x as API["_links"]).contact, isString) &&
    isLink((x as API["_links"]).documentation, isString) &&
    Array.isArray((x as API["_links"]).resources) &&
    (x as API["_links"]).resources.every(link => isTitledLink(link, isString))
export const isAPI = (x: unknown): x is API =>
    typeof x === "object" &&
    x !== null &&
    isAPILinks((x as API)._links) &&
    isPositiveInteger((x as API).build) &&
    isISOTimestamp((x as API).buildTimestamp) &&
    isNormalizedText((x as API).title) &&
    isNormalizedText((x as API).version)
export default isAPI
