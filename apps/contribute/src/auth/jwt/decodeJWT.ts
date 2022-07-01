import { decode, JwtPayload } from "jsonwebtoken"
import { JWT } from "../models/JWT"
import Payload from "../models/Payload"
const decodeJWT = (token: JWT) => {
    return decode(token, { json: true }) as (JwtPayload & Payload) | null
}
export default decodeJWT
