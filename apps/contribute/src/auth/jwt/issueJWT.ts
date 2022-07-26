import { isUUIDv4, normalizeUUID, UUID } from "@phylopic/utils"
import { randomUUID } from "crypto"
import DEFAULT_TTL from "../ttl/DEFAULT_TTL"
import MAX_TTL from "../ttl/MAX_TTL"
import MIN_TTL from "../ttl/MIN_TTL"
import createJWT from "./createJWT"
const issueJWT = async (subject: UUID, ttl = DEFAULT_TTL, issuedAt: Date) => {
    if (!isUUIDv4(subject)) {
        throw new Error(`Not a valid UUID (version 4): ${subject}`)
    }
    if (ttl < MIN_TTL) {
        ttl = MIN_TTL
    } else if (ttl > MAX_TTL) {
        ttl = MAX_TTL
    } else if (!isFinite(ttl)) {
        ttl = DEFAULT_TTL
    }
    const jti = normalizeUUID(randomUUID())
    const expiration = new Date(issuedAt.valueOf() + ttl)
    const token = await createJWT({
        expiration,
        issuedAt,
        jti,
        subject,
    })
    if (!token) {
        console.error("Unable to create authorization token.")
        throw 500
    }
    return token
}
export default issueJWT
