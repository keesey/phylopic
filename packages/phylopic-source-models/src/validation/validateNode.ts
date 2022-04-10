import { Node } from "../models/Node"
import { normalizeNames } from "../normalization/normalizeNames"
import { stringifyNormalized } from "../normalization/stringifyNormalized"
import { validateISODateTime } from "./validateISODateTime"
import { validateName } from "./validateName"
import { validateUUID } from "./validateUUID"

export const validateNode = (value: Node | undefined, normalized?: boolean) => {
    if (!value) {
        throw new Error("No node data.")
    }
    if (!value.created) {
        throw new Error("Missing time of creation.")
    }
    if (!value.names || !Array.isArray(value.names)) {
        throw new Error("Missing names.")
    }
    if (!value.names.length) {
        throw new Error("Missing canonical name.")
    }
    if (value.parent !== undefined) {
        validateUUID(value.parent)
    }
    validateISODateTime(value.created)
    value.names.forEach(name => validateName(name, normalized))
    if (normalized) {
        if (stringifyNormalized(value.names) !== stringifyNormalized(normalizeNames(value.names))) {
            throw new Error("Names are not in proper order.")
        }
    }
}
