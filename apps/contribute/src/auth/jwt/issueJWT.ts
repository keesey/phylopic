import { EmailAddress, isEmailAddress, normalizeUUID } from "@phylopic/utils"
import { randomUUID } from "crypto"
import Payload from "~/auth/models/Payload"
import isPayload from "../models/isPayload"
import DEFAULT_TTL from "../ttl/DEFAULT_TTL"
import MAX_TTL from "../ttl/MAX_TTL"
import MIN_TTL from "../ttl/MIN_TTL"
import createJWT from "./createJWT"
const issueJWT = async (email: EmailAddress, payload: Payload, ttl = 24 * 60 * 60 * 1000) => {
    if (!isEmailAddress(email)) {
        throw new Error(`Not a valid email address: ${email}`)
    }
    if (!isPayload(payload)) {
        throw new Error("Invalid payload.")
    }
    if (ttl < MIN_TTL) {
        ttl = MIN_TTL
    } else if (ttl > MAX_TTL) {
        ttl = MAX_TTL
    } else if (isNaN(ttl)) {
        ttl = DEFAULT_TTL
    }
    const jti = normalizeUUID(randomUUID())
    const issuedAt = new Date()
    const expiration = new Date(issuedAt.valueOf() + ttl)
    const token = await createJWT({
        email,
        expiration,
        issuedAt,
        jti,
        payload,
    })
    if (!token) {
        console.error("Unable to create authorization token.")
        throw 500
    }
    return token
}
export default issueJWT
