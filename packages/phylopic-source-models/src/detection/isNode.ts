import { isISOTimestamp, isNomen, isUUID } from "phylopic-utils/src/models"
import isObject from "phylopic-utils/src/models/detection/isObject"
import { isTypeOrUndefined } from "phylopic-utils/src/detection"
import invalidate from "phylopic-utils/src/validation/invalidate"
import ValidationFaultCollector from "phylopic-utils/src/validation/ValidationFaultCollector"
import { Node } from "../types"
export const isNode = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node =>
    isObject(x, faultCollector) &&
    isISOTimestamp((x as Node).created, faultCollector?.sub("created")) &&
    ((Array.isArray((x as Node).names) && (x as Node).names.length >= 1) ||
        invalidate(faultCollector?.sub("names"), "Must be a nonempty array.")) &&
    (x as Node).names.every((name, index) => isNomen(name, faultCollector?.sub("names", index.toString()))) &&
    isTypeOrUndefined((x as Node).parent, isUUID, faultCollector?.sub("parent"))
export default isNode
