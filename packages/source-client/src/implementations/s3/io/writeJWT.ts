import { PutObjectCommandInput } from "@aws-sdk/client-s3"
import { isJWT, JWT } from "@phylopic/source-models"
import jsonwebtoken from "jsonwebtoken"
import { ValidationError, ValidationFaultCollector } from "@phylopic/utils"
export const writeJWT = async (value: JWT): Promise<Partial<PutObjectCommandInput>> => {
    const collector = new ValidationFaultCollector()
    if (!isJWT(value, collector)) {
        throw new ValidationError(collector.list(), "Invalid payload.")
    }
    const { exp } = jsonwebtoken.decode(value, { json: true }) ?? {}
    const Expires = typeof exp === "number" ? new Date(exp * 1000) : undefined
    return {
        Body: value,
        ContentType: "application/jwt",
        Expires,
    }
}
