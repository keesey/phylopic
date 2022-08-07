import { isNormalizedText, isObject, ValidationFaultCollector } from "@phylopic/utils"
import { External } from "../types/External"
export const isExternal = (x: unknown, faultCollector?: ValidationFaultCollector): x is External =>
    isObject(x, faultCollector) &&
    isNormalizedText((x as External).href, faultCollector?.sub("href")) &&
    isNormalizedText((x as External).title, faultCollector?.sub("title"))
export default isExternal
