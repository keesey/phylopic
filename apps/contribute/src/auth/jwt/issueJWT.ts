import { EmailAddress } from "@phylopic/utils"
import { randomUUID } from "crypto"
import Payload from "~/auth/Payload"
import createJWT from "./createJWT"
const issueJWT = async (email: EmailAddress, payload: Payload, ttl = 24 * 60 * 60 * 1000) => {
    const uuid = randomUUID().toLowerCase()
    const issuedAt = new Date()
    const expiration = new Date(issuedAt.valueOf() + ttl)
    const token = await createJWT({
        email,
        expiration,
        issuedAt,
        payload,
        uuid,
    })
    if (!token) {
        console.error("Unable to create authorization token.")
        throw 500
    }
    return token
}
export default issueJWT
