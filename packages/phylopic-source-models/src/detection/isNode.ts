import { isISOTimestamp, isNomen, isUUID } from "phylopic-utils/src/models"
import { isTypeOrUndefined } from "phylopic-utils/src/types"
import invalidate from "phylopic-utils/src/validation/invalidate"
import ValidationFaultCollector from "phylopic-utils/src/validation/ValidationFaultCollector"
import { Node } from "../types"
export const isNode = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node =>
    ((typeof x === "object" && x !== null) || invalidate(faultCollector, "Expected an object.")) &&
    isISOTimestamp((x as Node).created, faultCollector?.sub("created")) &&
    ((Array.isArray((x as Node).names) && (x as Node).names.length >= 1) ||
        invalidate(faultCollector?.sub("names"), "Must be a nonempty array.")) &&
    (x as Node).names.every((name, index) => isNomen(name, faultCollector?.sub("names", index.toString()))) &&
    isTypeOrUndefined((x as Node).parent, isUUID, faultCollector?.sub("parent"))
export default isNode
