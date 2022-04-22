import { isIdentifier, isNomen, isObject, isUndefinedOr, ValidationFaultCollector } from "phylopic-utils/src"
import { NodeIdentifier } from "../types"
export const isNodeIdentifier = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeIdentifier =>
    isObject(x, faultCollector) &&
    isUndefinedOr(isIdentifier)((x as NodeIdentifier).identifier, faultCollector?.sub("identifier")) &&
    isNomen((x as NodeIdentifier).name, faultCollector?.sub("name"))
export default isNodeIdentifier
