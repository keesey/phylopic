import { PutObjectCommandInput } from "@aws-sdk/client-s3"
import { decodeJWT, invalidate, isJWT, JWT, verifyJWT } from "@phylopic/source-models"
import { ValidationError, ValidationFaultCollector } from "@phylopic/utils"

export const writeJWT = async (value: JWT): Promise<Partial<PutObjectCommandInput>> => {
    const collector = new ValidationFaultCollector()
    if (!isJWT(value, collector)) {
        throw new ValidationError(collector.list(), "Invalid payload.")
    }
    const secret = process.env.AUTH_SECRET_KEY
    if (!secret || !verifyJWT(value, secret)) {
        invalidate(collector, "Invalid or unverifiable JSON Web Token.")
        throw new ValidationError(collector.list(), "Invalid payload.")
    }
    const { exp } = decodeJWT(value) ?? {}
    const Expires = typeof exp === "number" ? new Date(exp * 1000) : undefined
    return {
        Body: value,
        ContentType: "application/jwt",
        Expires,
    }
}
