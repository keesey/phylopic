import { JWT } from "@phylopic/source-models"
import { decode, JwtPayload } from "jsonwebtoken"
const decodeJWT = (token: JWT) => {
    return decode(token, { json: true }) as JwtPayload | null
}
export default decodeJWT
