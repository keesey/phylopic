import jsonwebtoken, { type JwtPayload } from "jsonwebtoken"
import type { JWT } from "../types/JWT"

export const decodeJWT = (token: JWT): JwtPayload | null =>
    jsonwebtoken.decode(token, { json: true }) as JwtPayload | null
