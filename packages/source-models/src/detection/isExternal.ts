import { isNormalizedText, isObject, isUUIDv4, ValidationFaultCollector } from "@phylopic/utils"
import { External } from "../types/External"
export const isExternal = (x: unknown, faultCollector?: ValidationFaultCollector): x is External =>
    isObject(x, faultCollector) &&
    isUUIDv4((x as External).node, faultCollector?.sub("node")) &&
    isNormalizedText((x as External).title, faultCollector?.sub("title"))
export default isExternal
