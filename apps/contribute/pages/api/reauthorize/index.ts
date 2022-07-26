import { isEmailAddress, isPositiveInteger, isUUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import getBearerJWT from "~/auth/http/getBearerJWT"
import issueJWT from "~/auth/jwt/issueJWT"
import verifyJWT from "~/auth/jwt/verifyJWT"
import { JWT } from "~/auth/models/JWT"
import DEFAULT_TTL from "~/auth/ttl/DEFAULT_TTL"
import isTTLPayload from "~/auth/ttl/isTTLPayload"
import MAX_TTL from "~/auth/ttl/MAX_TTL"
import MIN_TTL from "~/auth/ttl/MIN_TTL"
import handleAPIError from "~/errors/handleAPIError"
const handlePost = async (authorization: string | undefined, ttl: number): Promise<JWT> => {
    const now = new Date()
    const token = getBearerJWT(authorization)
    const { sub: email, exp, uuid } = (await verifyJWT(token)) ?? {}
    if (!isEmailAddress(email) || !isUUID(uuid) || !isPositiveInteger(exp) || exp * 1000 <= now.valueOf()) {
        throw 401
    }
    return await issueJWT(uuid, ttl, now)
}
const getTTL = (body: unknown) => {
    if (!isTTLPayload(body)) {
        throw 400
    }
    return Math.max(MIN_TTL, Math.min(MAX_TTL, body.ttl ?? DEFAULT_TTL))
}
const index: NextApiHandler<string | null> = async (req, res) => {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.setHeader("cache-control", "max-age=3600")
            res.setHeader("date", new Date().toUTCString())
            res.status(204)
        } else if (req.method === "POST") {
            const ttl = getTTL(req.body)
            const token = await handlePost(req.headers.authorization, ttl)
            res.setHeader("content-type", "application/jwt")
            res.status(200)
            res.send(token)
        } else {
            throw 405
        }
    } catch (e) {
        handleAPIError(res, e)
    }
    res.end()
}
export default index
