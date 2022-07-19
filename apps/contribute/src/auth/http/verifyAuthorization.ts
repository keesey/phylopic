import { EmailAddress, isEmailAddress } from "@phylopic/utils"
import { NextApiRequest } from "next"
import verifyJWT from "../jwt/verifyJWT"
import getBearerJWT from "./getBearerJWT"
const verifyAuthorization = async (
    headers: Pick<NextApiRequest["headers"], "authorization">,
    emailAddress?: EmailAddress,
) => {
    const token = getBearerJWT(headers.authorization)
    const payload = await verifyJWT(token)
    const { sub } = payload ?? {}
    if (!isEmailAddress(sub)) {
        throw 401
    }
    if (emailAddress && sub !== emailAddress) {
        throw 403
    }
    return payload
}
export default verifyAuthorization
