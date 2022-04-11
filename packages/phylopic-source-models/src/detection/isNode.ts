import { isISOTimestamp, isNomen, isUUID, UUID } from "phylopic-utils/src/models"
import { Node } from "../types"
const isUUIDOrUndefined = (x: unknown): x is UUID | undefined => x === undefined || isUUID(x)
export const isNode = (x: unknown): x is Node =>
    typeof x === "object" &&
    x !== null &&
    isISOTimestamp((x as Node).created) &&
    Array.isArray((x as Node).names) &&
    (x as Node).names.length >= 1 &&
    (x as Node).names.every(isNomen) &&
    isUUIDOrUndefined((x as Node).parent)
export default isNode
