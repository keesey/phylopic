import { isIdentifier, isNomen, isNullOr, isObject, ValidationFaultCollector } from "phylopic-utils"
import { NodeIdentifier } from "../types"
export const isNodeIdentifier = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeIdentifier =>
    isObject(x, faultCollector) &&
    isNullOr(isIdentifier)((x as NodeIdentifier).identifier, faultCollector?.sub("identifier")) &&
    isNomen((x as NodeIdentifier).name, faultCollector?.sub("name"))
export default isNodeIdentifier
