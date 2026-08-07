import { handleAPIError } from "@phylopic/source-client"
import { JWT } from "@phylopic/source-models"
import { isPositiveInteger, isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import getBearerJWT from "~/auth/http/getBearerJWT"
import issueJWT from "~/auth/jwt/issueJWT"
import verifyJWT from "~/auth/jwt/verifyJWT"
import getTTLFromBody from "~/auth/ttl/getTTLFromBody"
const handlePost = async (authorization: string | undefined, ttl: number): Promise<JWT> => {
    const now = new Date()
    const token = getBearerJWT(authorization)
    let payload: Awaited<ReturnType<typeof verifyJWT>>
    try {
        payload = await verifyJWT(token)
    } catch (e) {
        // A token that fails verification is an authorization failure, not a server error.
        console.warn(e)
        throw 401
    }
    const { sub: uuid, exp } = payload ?? {}
    if (!isUUIDv4(uuid) || !isPositiveInteger(exp) || exp * 1000 <= now.valueOf()) {
        throw 401
    }
    return await issueJWT(uuid, ttl, now)
}
const index: NextApiHandler<JWT> = async (req, res) => {
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.status(204)
        } else if (req.method === "POST") {
            const ttl = getTTLFromBody(req.body)
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
