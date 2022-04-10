import { validate } from "uuid"
import { UUID } from "../models/UUID"

export const validateUUID = (value: UUID, normalized?: boolean) => {
    if (typeof value !== "string" || !validate(value)) {
        throw new Error(`Invalid UUID: ${value}.`)
    }
    if (normalized && value !== value.toLowerCase()) {
        throw new Error(`UUID is not in lower case: ${value}.`)
    }
}
