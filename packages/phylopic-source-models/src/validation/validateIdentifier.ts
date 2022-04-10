import { AuthorizedNamespace } from "../models/AuthorizedNamespace"
import { Identifier } from "../models/Identifier"
import { validateAuthorizedNamespace } from "./validateAuthorizedNamespace"
export const validateIdentifier = (value: Identifier) => {
    if (!Array.isArray(value) || value.length !== 3) {
        throw new Error(`Invalid identifier: ${JSON.stringify(value)}`)
    }
    const [authority, namespace, id] = value
    validateAuthorizedNamespace([authority, namespace] as AuthorizedNamespace)
    if (typeof id !== "string" || id === "" || id !== id.trim()) {
        throw new Error(`Invalid object ID: ${JSON.stringify(id)}`)
    }
}
