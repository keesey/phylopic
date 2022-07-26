import { JwtPayload } from "jsonwebtoken"
import { NextApiRequest } from "next"
import verifyJWT from "../jwt/verifyJWT"
import getBearerJWT from "./getBearerJWT"
const verifyAuthorization = async (
    headers: Pick<NextApiRequest["headers"], "authorization">,
    expectedFields?: Partial<JwtPayload>,
) => {
    const token = getBearerJWT(headers.authorization)
    const payload = await verifyJWT(token)
    if (payload && expectedFields) {
        for (const field of Object.keys(expectedFields)) {
            if (payload[field] !== expectedFields[field]) {
                throw 403
            }
        }
    }
    return payload
}
export default verifyAuthorization
