import { isArray, isISOTimestamp, isNormalizedText, isURL, ValidationFaultCollector } from "@phylopic/utils"
import { API } from "../types"
import isData from "./isData"
import isLink from "./isLink"
import isLinks from "./isLinks"
import isTitledLink from "./isTitledLink"
const isAPILinks = (x: unknown, faultCollector?: ValidationFaultCollector): x is API["_links"] =>
    isLinks(x, faultCollector) &&
    isTitledLink(isNormalizedText)((x as API["_links"]).contact, faultCollector?.sub("contact")) &&
    isLink(isURL)((x as API["_links"]).documentation, faultCollector?.sub("documentation")) &&
    isArray(isTitledLink(isNormalizedText))((x as API["_links"]).resources, faultCollector?.sub("resources"))
export const isAPI = (x: unknown, faultCollector?: ValidationFaultCollector): x is API =>
    isData(x, faultCollector) &&
    isAPILinks((x as API)._links, faultCollector?.sub("_links")) &&
    isISOTimestamp((x as API).buildTimestamp, faultCollector?.sub("buildTimestamp")) &&
    isNormalizedText((x as API).title, faultCollector?.sub("title")) &&
    isNormalizedText((x as API).version, faultCollector?.sub("version"))
export default isAPI
