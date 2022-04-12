import { isArray, isNormalizedText, isObject } from "phylopic-utils/src/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { QueryMatches } from ".."
import isLinks from "./isLinks"
export const isQueryMatches = (x: unknown, faultCollector?: ValidationFaultCollector): x is QueryMatches =>
    isObject(x, faultCollector) &&
    isLinks((x as QueryMatches)._links, faultCollector?.sub("_links")) &&
    isArray(isNormalizedText)((x as QueryMatches).matches, faultCollector?.sub("matches"))
export default isQueryMatches
