import { isIdentifier, isNomen } from "phylopic-utils/src/models"
import isObject from "phylopic-utils/src/models/detection/isObject"
import { isTypeOrUndefined } from "phylopic-utils/src/detection"
import ValidationFaultCollector from "phylopic-utils/src/validation/ValidationFaultCollector"
import { NodeIdentifier } from "../types"
export const isNodeIdentifier = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeIdentifier =>
    isObject(x, faultCollector) &&
    isTypeOrUndefined((x as NodeIdentifier).identifier, isIdentifier, faultCollector?.sub("identifier")) &&
    isNomen((x as NodeIdentifier).name, faultCollector?.sub("name"))
export default isNodeIdentifier
