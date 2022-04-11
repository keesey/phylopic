import { Identifier, isIdentifier, isNomen } from "phylopic-utils/src/models"
import { NodeIdentifier } from "../types"
const isIdentifierOrUndefined = (x: unknown): x is Identifier | undefined => x === undefined || isIdentifier(x)
export const isNodeIdentifier = (x: unknown): x is NodeIdentifier =>
    typeof x === "object" &&
    x !== null &&
    isIdentifierOrUndefined((x as NodeIdentifier).identifier) &&
    isNomen((x as NodeIdentifier).name)
export default isNodeIdentifier
