import type { ValidationFaultCollector } from "@phylopic/utils"
import { isObject, isUUID } from "@phylopic/utils"
import { Source } from "../types/Source"
export const isSource = (x: unknown, faultCollector?: ValidationFaultCollector): x is Source =>
    isObject(x, faultCollector) && isUUID((x as Source).root, faultCollector?.sub("root"))
export default isSource
