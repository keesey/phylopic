import { isNonemptyArray, isObject, isUndefinedOr } from "phylopic-utils/src/detection"
import { isISOTimestamp, isNomen, isUUID } from "phylopic-utils/src/models/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Node } from "../types"
export const isNode = (x: unknown, faultCollector?: ValidationFaultCollector): x is Node =>
    isObject(x, faultCollector) &&
    isISOTimestamp((x as Node).created, faultCollector?.sub("created")) &&
    isNonemptyArray(isNomen)((x as Node).names, faultCollector?.sub("names")) &&
    isUndefinedOr(isUUID)((x as Node).parent, faultCollector?.sub("parent"))
export default isNode
