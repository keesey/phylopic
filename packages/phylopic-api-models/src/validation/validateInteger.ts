import { ValidationFault } from "./ValidationFault"
export const validateInteger = (
    value: unknown,
    field: string,
    minimum?: number,
    maximum?: number,
): readonly ValidationFault[] => {
    if (typeof value !== "undefined" && typeof value !== "string") {
        return [
            {
                field,
                message: `Expected a string, or undefined: ${value}.`,
            },
        ]
    }
    if (value) {
        const n = parseInt(value, 10)
        if (isNaN(n)) {
            return [
                {
                    field,
                    message: `Not an integer: "${value}".`,
                },
            ]
        }
        const faults: ValidationFault[] = []
        if (typeof minimum === "number" && n < minimum) {
            faults.push({
                field,
                message: `Value must be greater than ${minimum}: ${n}.`,
            })
        }
        if (typeof maximum === "number" && n > maximum) {
            faults.push({
                field,
                message: `Value must be less than ${maximum}: ${n}.`,
            })
        }
        return faults
    }
    return []
}
export default validateInteger
