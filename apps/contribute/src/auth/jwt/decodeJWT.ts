import { decode, JwtPayload } from "jsonwebtoken"
import { JWT } from "../JWT"
import Payload from "../Payload"
const decodeJWT = (token: JWT) => {
    return decode(token, { json: true }) as (JwtPayload & Payload) | null
}
export default decodeJWT
