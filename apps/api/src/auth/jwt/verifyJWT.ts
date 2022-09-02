import { JWT } from "@phylopic/source-models"
import { JwtPayload, verify } from "jsonwebtoken"
import APIError from "../../errors/APIError"
import DOMAIN from "./DOMAIN"
const verifyJWT = (token: JWT) =>
    new Promise<JwtPayload | null>((resolve, reject) => {
        if (!process.env.AUTH_SECRET_KEY) {
            throw new APIError(500, [
                {
                    developerMessage: "The AUTH_SECRET_KEY environment variable is missing.",
                    type: "DEFAULT_5XX",
                    userMessage: "Something is wrong with the server. Please check back later.",
                },
            ])
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
                    console.error(err)
                    return reject(
                        new APIError(401, [
                            {
                                developerMessage: String(err),
                                field: "authorization",
                                type: "UNAUTHORIZED",
                                userMessage: "Please sign out and sign back in.",
                            },
                        ]),
                    )
                }
                if (!decoded) {
                    throw new APIError(401, [
                        {
                            developerMessage: "Could not read token with secret: " + process.env.AUTH_SECRET_KEY,
                            field: "authorization",
                            type: "UNAUTHORIZED",
                            userMessage: "Please sign out and sign back in.",
                        },
                    ])
                }
                if (typeof decoded === "string") {
                    try {
                        const payload: JwtPayload = JSON.parse(decoded)
                        return resolve(payload)
                    } catch (e) {
                        console.error(e)
                        return reject(
                            new APIError(401, [
                                {
                                    developerMessage: String(e),
                                    field: "authorization",
                                    type: "UNAUTHORIZED",
                                    userMessage: "Please sign out and sign back in.",
                                },
                            ]),
                        )
                    }
                }
                resolve((decoded ?? null) as JwtPayload | null)
            },
        )
    })
export default verifyJWT
