import { NOMEN_PART_CLASSES } from "parse-nomen"
import { NodeName } from "../models/NodeName"
import { ValidationFault } from "./ValidationFault"
export const validateNodeName = (name: NodeName, index: number, field = "names") => {
    const faults: ValidationFault[] = []
    if (!Array.isArray(name)) {
        faults.push({
            field: `${field}[${index}]`,
            message: "Node name is not an array.",
        })
    } else if (!name.length) {
        faults.push({
            field: `${field}[${index}]`,
            message: "Node name is empty.",
        })
    } else {
        name.forEach((part, partIndex) => {
            if (!part || typeof part !== "object") {
                faults.push({
                    field: `${field}[${index}][${partIndex}]`,
                    message: "Node name part is not an object.",
                })
            }
            if (NOMEN_PART_CLASSES.indexOf(part.class) < 0) {
                faults.push({
                    field: `${field}[${index}][${partIndex}].class`,
                    message: `Invalid node name class: "${part.class}".`,
                })
            }
            if (!part.text || typeof part.text !== "string" || part.text !== part.text.trim()) {
                faults.push({
                    field: `${field}[${index}][${partIndex}].text`,
                    message: `Invalid node name text: "${part.text}".`,
                })
            }
        })
    }
    return faults as readonly ValidationFault[]
}
export default validateNodeName
