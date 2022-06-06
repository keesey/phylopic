import { JWT } from "../JWT"
import decodeJWT from "../jwt/decodeJWT"
import verifyJWT from "../jwt/verifyJWT"
const sendAuthEmail = async (token: JWT, verify = false) => {
    const payload = verify ? await verifyJWT(token) : decodeJWT(token)
    if (!payload?.jti || !payload.iat || !payload.name || !payload.sub) {
        throw new Error("Invalid token.")
    }
    // :TODO: Hook up to email service.
    console.log("--------")
    console.log("To: ", payload.sub)
    console.log("Date: ", new Date(payload.iat * 1000).toUTCString())
    console.log("--------")
    console.log(`Hey ${payload.name},`)
    console.log("")
    console.log(
        `Open this link: https://contribute.phylopic.org/authorize/${encodeURIComponent(
            payload.sub,
        )}/${encodeURIComponent(payload.jti)}`,
    )
    console.log("--------")
}
export default sendAuthEmail
