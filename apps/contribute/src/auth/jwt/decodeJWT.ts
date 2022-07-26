import { decode, JwtPayload } from "jsonwebtoken"
import { JWT } from "../models/JWT"
const decodeJWT = (token: JWT) => {
    return decode(token, { json: true }) as JwtPayload | null
}
export default decodeJWT
