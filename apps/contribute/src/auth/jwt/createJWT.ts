import { UUID } from "@phylopic/utils"
import { sign } from "jsonwebtoken"
import DOMAIN from "./DOMAIN"
export interface Args {
    expiration: Date
    issuedAt: Date
    jti: UUID
    subject: UUID
}
const createJWT = (args: Args) =>
    new Promise<string | undefined>((resolve, reject) => {
        if (!process.env.AUTH_SECRET_KEY) {
            throw new Error("The server is missing certain data required for authentication.")
        }
        sign(
            {
                exp: Math.floor(args.expiration.valueOf() / 1000),
                iat: Math.floor(args.issuedAt.valueOf() / 1000),
            },
            process.env.AUTH_SECRET_KEY,
            {
                audience: DOMAIN,
                issuer: DOMAIN,
                jwtid: args.jti,
                subject: args.subject,
            },
            (err, encoded) => (err ? reject(err) : resolve(encoded)),
        )
    })
export default createJWT
