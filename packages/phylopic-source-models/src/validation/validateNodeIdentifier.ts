import { NodeIdentifier } from "../models/NodeIdentifier"
import { validateIdentifier } from "./validateIdentifier"
import { validateName } from "./validateName"
export const validateNodeIdentifier = (value: NodeIdentifier, normalized?: boolean) => {
    if (!value || typeof value !== "object") {
        throw new Error("Missing or invalid node identifier.")
    }
    if (value.identifier !== undefined) {
        validateIdentifier(value.identifier)
    }
    validateName(value.name, normalized)
}
