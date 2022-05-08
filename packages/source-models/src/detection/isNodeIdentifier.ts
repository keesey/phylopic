import type { ValidationFaultCollector } from "@phylopic/utils"
import { isIdentifier, isNomen, isNullOr, isObject } from "@phylopic/utils"
import { NodeIdentifier } from "../types/NodeIdentifier.js"
export const isNodeIdentifier = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeIdentifier =>
    isObject(x, faultCollector) &&
    isNullOr(isIdentifier)((x as NodeIdentifier).identifier, faultCollector?.sub("identifier")) &&
    isNomen((x as NodeIdentifier).name, faultCollector?.sub("name"))
export default isNodeIdentifier
