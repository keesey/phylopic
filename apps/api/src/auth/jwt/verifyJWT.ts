import { JWT } from "@phylopic/source-models"
import { JwtPayload, verify } from "jsonwebtoken"
import DOMAIN from "./DOMAIN"
const verifyJWT = (token: JWT) =>
    new Promise<JwtPayload | null>((resolve, reject) => {
        if (!process.env.AUTH_SECRET_KEY) {
            throw new Error("The server is missing certain data required for authentication.")
        }
        verify(
            token,
            process.env.AUTH_SECRET_KEY,
            {
                audience: DOMAIN,
                issuer: DOMAIN,
            },
            (err, decoded) => {
                if (err) {
                    return reject(err)
                }
                if (typeof decoded === "string") {
                    try {
                        const payload: JwtPayload = JSON.parse(decoded)
                        return resolve(payload)
                    } catch (e) {
                        return reject(e)
                    }
                }
                resolve((decoded ?? null) as JwtPayload | null)
            },
        )
    })
export default verifyJWT
