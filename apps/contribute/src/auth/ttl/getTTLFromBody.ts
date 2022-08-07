import type { NextApiRequest } from "next"
import DEFAULT_TTL from "./DEFAULT_TTL"
import isTTLPayload from "./isTTLPayload"
import MAX_TTL from "./MAX_TTL"
import MIN_TTL from "./MIN_TTL"
const getTTLFromBody = (body: NextApiRequest["body"]) => {
    if (!isTTLPayload(body)) {
        throw 400
    }
    let { ttl } = body
    if (typeof ttl !== "number") {
        ttl = DEFAULT_TTL
    } else if (ttl < MIN_TTL) {
        ttl = MIN_TTL
    } else if (ttl > MAX_TTL) {
        ttl = MAX_TTL
    } else if (!isFinite(ttl)) {
        ttl = DEFAULT_TTL
    }
    return ttl
}
export default getTTLFromBody
