import { Nomen } from "../types"
import { NomenPart, NomenPartClass, NOMEN_PART_CLASSES } from "parse-nomen"
import { isNormalizedText } from "./isNormalizedText"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import invalidate from "../../validation/invalidate"
const NOMEN_PART_CLASS_VALIDATION_MESSAGE = `Must be one of these values: "${NOMEN_PART_CLASSES.join('", "')}".`
const isNomenPartClass = (x: unknown, faultCollector?: ValidationFaultCollector): x is NomenPartClass =>
    NOMEN_PART_CLASSES.includes(x as NomenPartClass) || invalidate(faultCollector, NOMEN_PART_CLASS_VALIDATION_MESSAGE)
const isNomenPart = (x: unknown, faultCollector?: ValidationFaultCollector): x is NomenPart => {
    if (typeof x === "object" && x !== null) {
        const keys = Object.keys(x)
        if (keys.length === 2 && keys.includes("class") && keys.includes("text")) {
            return (
                isNomenPartClass((x as NomenPart).class, faultCollector?.sub("class")) &&
                isNormalizedText((x as NomenPart).text, faultCollector?.sub("text"))
            )
        } else {
            return invalidate(
                faultCollector,
                'All parts of a nomen must have "class" and "text" properties, and no other properties.',
            )
        }
    }
    return invalidate(faultCollector, "All parts of a nomen must be non-null objects.")
}
export const isNomen = (x: unknown, faultCollector?: ValidationFaultCollector): x is Nomen =>
    ((Array.isArray(x) && x.length >= 1) || invalidate(faultCollector, "Nomen must be a nonempty array.")) &&
    (x as readonly unknown[]).every((part, index) => isNomenPart(part, faultCollector?.sub(index.toString())))
export default isNomen
