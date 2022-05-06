import { isNormalizedText } from "@phylopic/utils/dist/detection"
import type { ValidationFaultCollector } from "@phylopic/utils/dist/validation"
import { SearchParameters } from "../types"
import isDataParameters from "./isDataParameters"
export const isQueryParameters = (x: unknown, faultCollector?: ValidationFaultCollector) =>
    isDataParameters(x, faultCollector) && isNormalizedText((x as SearchParameters).query, faultCollector?.sub("query"))
export default isQueryParameters
