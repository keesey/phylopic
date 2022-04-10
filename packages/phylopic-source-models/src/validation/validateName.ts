import { NOMEN_PART_CLASSES } from "parse-nomen"
import { Name } from "../models/Name"
import { validateText } from "./validateText"

export const validateName = (name: Name, normalized?: boolean) => {
    if (!name?.length) {
        throw new Error("Invalid name.")
    }
    name.every((part, index) => {
        if (
            !part ||
            typeof part !== "object" ||
            Object.keys(part).sort().join("|") !== "class|text" ||
            typeof part.class !== "string" ||
            typeof part.text !== "string"
        ) {
            throw new Error("Invalid name part.")
        }
        if (!NOMEN_PART_CLASSES.includes(part.class)) {
            throw new Error("Invalid name class.")
        }
        validateText(part.text, normalized)
        if (normalized && index > 0 && name[index - 1].class === part.class) {
            throw new Error("Name is not normalized.")
        }
    })
}
