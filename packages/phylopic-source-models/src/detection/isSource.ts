import { isObject } from "phylopic-utils/src/detection"
import { isUUID } from "phylopic-utils/src/models/detection"
import ValidationFaultCollector from "phylopic-utils/src/validation/ValidationFaultCollector"
import { Source } from "../types"
export const isSource = (x: unknown, faultCollector?: ValidationFaultCollector): x is Source =>
    isObject(x, faultCollector) && isUUID((x as Source).root, faultCollector?.sub("root"))
export default isSource
