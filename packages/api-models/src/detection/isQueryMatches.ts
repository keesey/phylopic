import { isArray, isNormalizedText } from "@phylopic/utils/dist/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { QueryMatches } from ".."
import isData from "./isData"
import isLinks from "./isLinks"
export const isQueryMatches = (x: unknown, faultCollector?: ValidationFaultCollector): x is QueryMatches =>
    isData(x, faultCollector) &&
    isLinks((x as QueryMatches)._links, faultCollector?.sub("_links")) &&
    isArray(isNormalizedText)((x as QueryMatches).matches, faultCollector?.sub("matches"))
export default isQueryMatches
