import { JwtPayload } from "jsonwebtoken"
import { NextApiRequest } from "next"
import verifyJWT from "../jwt/verifyJWT"
import getBearerJWT from "./getBearerJWT"
const verifyAuthorization = async (
    headers: Pick<NextApiRequest["headers"], "authorization">,
    expectedFields?: Partial<JwtPayload>,
) => {
    const token = getBearerJWT(headers.authorization)
    let payload: JwtPayload | null
    try {
        payload = await verifyJWT(token)
    } catch (e) {
        // A token that fails verification is an authorization failure, not a server error.
        // Clients rely on the 401 to discard the stored token; see useAuthorizedRequest.
        console.warn(e)
        throw 401
    }
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
