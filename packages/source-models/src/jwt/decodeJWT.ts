import jsonwebtoken, { JwtPayload } from "jsonwebtoken"
import { JWT } from "../types/JWT"

export const decodeJWT = (token: JWT): JwtPayload | null =>
    jsonwebtoken.decode(token, { json: true }) as JwtPayload | null
