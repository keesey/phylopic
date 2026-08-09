import { invalidate, ValidationFaultCollector } from "@phylopic/utils"
import jsonwebtoken from "jsonwebtoken"
import { JWT } from "../types/JWT"
export const isJWT = (token: unknown, collector?: ValidationFaultCollector): token is JWT =>
    (typeof token === "string" && jsonwebtoken.decode(token, { complete: true }) !== null) ||
    invalidate(collector, "Expected a valid JSON Web Token.")
