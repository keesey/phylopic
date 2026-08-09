import jsonwebtoken, { JwtPayload } from "jsonwebtoken"
import { JWT_ALGORITHMS, JWT_AUDIENCE, JWT_ISSUER } from "./constants"

export const verifyJWT = (token: string, secret: string): JwtPayload | null => {
    try {
        const payload = jsonwebtoken.verify(token, secret, {
            algorithms: [...JWT_ALGORITHMS],
            audience: JWT_AUDIENCE,
            issuer: JWT_ISSUER,
        })
        if (typeof payload === "string") {
            return JSON.parse(payload) as JwtPayload
        }
        return payload
    } catch {
        return null
    }
}
