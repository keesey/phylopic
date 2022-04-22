import { isObject, isUUID, ValidationFaultCollector } from "phylopic-utils/src"
import { Source } from "../types"
export const isSource = (x: unknown, faultCollector?: ValidationFaultCollector): x is Source =>
    isObject(x, faultCollector) && isUUID((x as Source).root, faultCollector?.sub("root"))
export default isSource
