import { isArray, isNormalizedText, isObject, ValidationFaultCollector } from "phylopic-utils/src"
import { QueryMatches } from ".."
import isLinks from "./isLinks"
export const isQueryMatches = (x: unknown, faultCollector?: ValidationFaultCollector): x is QueryMatches =>
    isObject(x, faultCollector) &&
    isLinks((x as QueryMatches)._links, faultCollector?.sub("_links")) &&
    isArray(isNormalizedText)((x as QueryMatches).matches, faultCollector?.sub("matches"))
export default isQueryMatches
