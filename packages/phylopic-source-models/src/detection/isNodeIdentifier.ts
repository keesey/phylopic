import { isObject, isUndefinedOr } from "phylopic-utils/src/detection"
import { isIdentifier, isNomen } from "phylopic-utils/src/models/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { NodeIdentifier } from "../types"
export const isNodeIdentifier = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeIdentifier =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isIdentifier)((x as NodeIdentifier).identifier, faultCollector?.sub("identifier")) &&
    isNomen((x as NodeIdentifier).name, faultCollector?.sub("name"))
export default isNodeIdentifier
