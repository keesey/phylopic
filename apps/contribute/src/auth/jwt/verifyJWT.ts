import { JWT, verifyJWT as verifyJWTToken } from "@phylopic/source-models"
import { JwtPayload } from "jsonwebtoken"

const verifyJWT = (token: JWT) => {
    const secret = process.env.AUTH_SECRET_KEY
    if (!secret) {
        return Promise.reject(new Error("The server is missing certain data required for authentication."))
    }
    const payload = verifyJWTToken(token, secret)
    if (!payload) {
        return Promise.reject(new Error("Invalid token."))
    }
    return Promise.resolve(payload as JwtPayload)
}

export default verifyJWT
