import { EmailAddress, UUID } from "@phylopic/utils"
import { sign } from "jsonwebtoken"
import Payload from "../models/Payload"
export interface Args {
    email: EmailAddress
    expiration: Date
    issuedAt: Date
    jti: UUID
    payload: Payload
}
const createJWT = (args: Args) =>
    new Promise<string | undefined>((resolve, reject) => {
        sign(
            {
                ...args.payload,
                exp: Math.floor(args.expiration.valueOf() / 1000),
                iat: Math.floor(args.issuedAt.valueOf() / 1000),
            },
            process.env.AUTH_SECRET_KEY ?? "",
            {
                audience: "https://contribute.phylopic.org",
                issuer: "https://contribute.phylopic.org",
                jwtid: args.jti,
                subject: args.email,
            },
            (err, encoded) => (err ? reject(err) : resolve(encoded)),
        )
    })
export default createJWT
