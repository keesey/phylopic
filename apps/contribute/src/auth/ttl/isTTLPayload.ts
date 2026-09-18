import { isObject, isPositiveInteger, isUndefinedOr } from "@phylopic/utils"
import type { TTLPayload } from "./TTLPayload"

const isTTLPayload = (x: unknown): x is TTLPayload => {
    return isObject(x) && isUndefinedOr(isPositiveInteger)((x as TTLPayload).ttl)
}

export default isTTLPayload
