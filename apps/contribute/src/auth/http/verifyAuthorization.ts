import { EmailAddress } from "@phylopic/utils"
import { NextApiRequest } from "next"
import verifyJWT from "../jwt/verifyJWT"
import getBearerJWT from "./getBearerJWT"
const verifyAuthorization = async (
    headers: Pick<NextApiRequest["headers"], "authorization">,
    emailAddress?: EmailAddress,
) => {
    const token = getBearerJWT(headers.authorization)
    const payload = await verifyJWT(token)
    if (!payload?.sub) {
        throw 401
    }
    if (emailAddress && payload.sub !== emailAddress) {
        throw 403
    }
}
export default verifyAuthorization
