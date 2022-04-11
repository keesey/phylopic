import { isUUID, UUID } from "phylopic-utils/src/models"
import { Source } from "../types"
const isUUIDOrUndefined = (x: unknown): x is UUID | undefined => x === undefined || isUUID(x)
export const isSource = (x: unknown): x is Source =>
    typeof x === "object" && x !== null && isUUIDOrUndefined((x as Source).root)
export default isSource
