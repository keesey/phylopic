import { FaultDetector } from "../../detection/FaultDetector.js"
import invalidate from "../../validation/invalidate.js"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector.js"
import { Identifier } from "../types/Identifier.js"
import isAuthority from "./isAuthority.js"
import isNamespace from "./isNamespace.js"
import isObjectID from "./isObjectID.js"
export const isIdentifier: FaultDetector<Identifier> = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is Identifier => {
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
