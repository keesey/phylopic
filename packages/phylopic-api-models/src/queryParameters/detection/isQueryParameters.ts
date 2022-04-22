import { isNormalizedText, ValidationFaultCollector } from "phylopic-utils/src"
import { SearchParameters } from "../types"
import isDataParameters from "./isDataParameters"
export const isQueryParameters = (x: unknown, faultCollector?: ValidationFaultCollector) =>
    isDataParameters(x, faultCollector) && isNormalizedText((x as SearchParameters).query, faultCollector?.sub("query"))
export default isQueryParameters
