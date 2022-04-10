import { v4 } from "is-uuid"
import { ValidationFault } from "./ValidationFault"
export const validateUUIDv4 = (value: unknown, field: string): readonly ValidationFault[] => {
    if (typeof value !== "string") {
        return [
            {
                field,
                message: `Expected a UUID string: ${value}.`,
            },
        ]
    }
    if (!v4(value)) {
        return [
            {
                field,
                message: `Not a valid UUID v4: "${value}".`,
            },
        ]
    }
    return []
}
export default validateUUIDv4
