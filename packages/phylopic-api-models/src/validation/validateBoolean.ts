import { ValidationFault } from "./ValidationFault"
export const validateBoolean = (value: unknown, field: string, fieldLabel: string): readonly ValidationFault[] => {
    if (typeof value !== "undefined" && typeof value !== "string") {
        return [
            {
                field,
                message: `Expected a string, or undefined: ${value}.`,
            },
        ]
    }
    if (value && value !== "true" && value !== "false") {
        return [
            {
                field,
                message: `Not a valid ${fieldLabel}: "${value}".`,
            },
        ]
    }
    return []
}
export default validateBoolean
