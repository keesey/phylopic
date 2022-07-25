import { JwtPayload } from "jsonwebtoken"
import { NextApiRequest } from "next"
import verifyJWT from "../jwt/verifyJWT"
import isPayload from "../models/isPayload"
import Payload from "../models/Payload"
import getBearerJWT from "./getBearerJWT"
const verifyAuthorization = async (
    headers: Pick<NextApiRequest["headers"], "authorization">,
    expectedFields?: Partial<JwtPayload & Payload>,
) => {
    const token = getBearerJWT(headers.authorization)
    const payload = await verifyJWT(token)
    if (!isPayload(payload)) {
        throw 401
    }
    if (expectedFields) {
        for (const field of Object.keys(expectedFields)) {
            if (payload[field] !== expectedFields[field]) {
                throw 403
            }
        }
    }
    return payload
}
export default verifyAuthorization
