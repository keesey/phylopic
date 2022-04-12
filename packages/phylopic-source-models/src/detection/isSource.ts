import { isUUID } from "phylopic-utils/src/models"
import invalidate from "phylopic-utils/src/validation/invalidate"
import ValidationFaultCollector from "phylopic-utils/src/validation/ValidationFaultCollector"
import { Source } from "../types"
export const isSource = (x: unknown, faultCollector?: ValidationFaultCollector): x is Source =>
    ((typeof x === "object" && x !== null) || invalidate(faultCollector, "Expected an object.")) &&
    isUUID((x as Source).root, faultCollector?.sub("root"))
export default isSource
