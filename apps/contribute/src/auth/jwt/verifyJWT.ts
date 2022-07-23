import { JwtPayload, verify } from "jsonwebtoken"
import isPayload from "../models/isPayload"
import { JWT } from "../models/JWT"
import Payload from "../models/Payload"
import DOMAIN from "./DOMAIN"
const verifyJWT = (token: JWT) =>
    new Promise<(JwtPayload & Payload) | null>((resolve, reject) => {
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
                        const payload: JwtPayload & Payload = JSON.parse(decoded)
                        if (!isPayload(payload)) {
                            throw new Error("Invalid payload.");
                            
                        }
                        return resolve(payload)
                    } catch (e) {
                        return reject(e)
                    }
                }
                resolve((decoded ?? null) as (JwtPayload & Payload) | null)
            },
        )
    })
export default verifyJWT
