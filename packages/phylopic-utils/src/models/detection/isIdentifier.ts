import { Identifier } from "../types"
import isAuthority from "./isAuthority"
import isNamespace from "./isNamespace"
import isObjectID from "./isObjectID"
export const isIdentifier = (x: unknown): x is Identifier => {
    if (typeof x === "string") {
        const parts = x.split(/\//g)
        if (parts.length === 3) {
            const [authority, namespace, objectId] = parts
            return isAuthority(authority) && isNamespace(namespace) && isObjectID(objectId)
        }
    }
    return false
}
export default isIdentifier
