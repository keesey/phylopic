import { JwtPayload, verify } from "jsonwebtoken"
import { JWT } from "../JWT"
import Payload from "../Payload"
const verifyJWT = (token: JWT) =>
    new Promise<(JwtPayload & Payload) | null>((resolve, reject) => {
        verify(
            token,
            process.env.AUTH_SECRET_KEY ?? "",
            {
                audience: "https://contribute.phylopic.org",
                issuer: "https://contribute.phylopic.org",
            },
            (err, decoded) => {
                if (err) {
                    return reject(err)
                }
                if (typeof decoded === "string") {
                    return resolve(JSON.parse(decoded))
                }
                resolve((decoded ?? null) as (JwtPayload & Payload) | null)
            },
        )
    })
export default verifyJWT
