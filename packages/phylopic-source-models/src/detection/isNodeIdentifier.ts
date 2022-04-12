import { isIdentifier, isNomen } from "phylopic-utils/src/models"
import { isTypeOrUndefined } from "phylopic-utils/src/types"
import invalidate from "phylopic-utils/src/validation/invalidate"
import ValidationFaultCollector from "phylopic-utils/src/validation/ValidationFaultCollector"
import { NodeIdentifier } from "../types"
export const isNodeIdentifier = (x: unknown, faultCollector?: ValidationFaultCollector): x is NodeIdentifier =>
    ((typeof x === "object" && x !== null) || invalidate(faultCollector, "Expected an object.")) &&
    isTypeOrUndefined((x as NodeIdentifier).identifier, isIdentifier, faultCollector?.sub("identifier")) &&
    isNomen((x as NodeIdentifier).name, faultCollector?.sub("name"))
export default isNodeIdentifier
