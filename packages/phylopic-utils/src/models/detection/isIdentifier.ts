import invalidate from "../../validation/invalidate"
import { ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { Identifier } from "../types"
import isAuthority from "./isAuthority"
import isNamespace from "./isNamespace"
import isObjectID from "./isObjectID"
export const isIdentifier = (x: unknown, faultCollector?: ValidationFaultCollector): x is Identifier => {
    if (typeof x === "string") {
        const parts = x.split(/\//g)
        if (parts.length === 3) {
            const [authority, namespace, objectId] = parts
            return (
                (isAuthority(authority) && isNamespace(namespace) && isObjectID(objectId)) ||
                invalidate(faultCollector, "All parts of an identifier must be normalized text.")
            )
        }
    }
    return invalidate(faultCollector, "Expected identifier with format `authority/namespace/objectID`.")
}
export default isIdentifier
