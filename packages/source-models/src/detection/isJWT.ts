import { invalidate, ValidationFaultCollector } from "@phylopic/utils"
import jsonwebtoken from "jsonwebtoken"
import { JWT } from "../types/JWT"
export const isJWT = (token: unknown, collector?: ValidationFaultCollector): token is JWT => {
    return Boolean(
        (typeof token === "string" && jsonwebtoken.decode(token, { json: true })) ||
            invalidate(collector, "Expected a valid JSON Web Token."),
    )
}
