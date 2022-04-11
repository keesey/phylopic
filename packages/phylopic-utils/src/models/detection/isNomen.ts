import { Nomen } from "../types"
import { NomenPart, NomenPartClass, NOMEN_PART_CLASSES } from "parse-nomen"
import { isNormalizedText } from "./isNormalizedText"
const isNomenPartClass = (x: unknown): x is NomenPartClass => NOMEN_PART_CLASSES.includes(x as NomenPartClass)
const isNomenPart = (x: unknown): x is NomenPart => {
    if (typeof x === "object" && x !== null) {
        const keys = Object.keys(x)
        if (keys.length === 2 && keys.includes("class") && keys.includes("text")) {
            return isNomenPartClass((x as NomenPart).class) && isNormalizedText((x as NomenPart).text)
        }
    }
    return false
}
export const isNomen = (x: unknown): x is Nomen => Array.isArray(x) && x.length >= 1 && x.every(isNomenPart)
export default isNomen
