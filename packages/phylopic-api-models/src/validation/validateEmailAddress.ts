import { validate } from "email-validator"
import { ValidationFault } from "./ValidationFault"
export const validateEmailAddress = (value: unknown, field: string): readonly ValidationFault[] => {
    if (typeof value !== "undefined" && typeof value !== "string") {
        return [
            {
                field,
                message: `Expected a string, or undefined: ${value}.`,
            },
        ]
    }
    if (value && !validate(value)) {
        return [
            {
                field,
                message: `Not a valid email address: "${value}".`,
            },
        ]
    }
    return []
}
export default validateEmailAddress
