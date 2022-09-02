import { isUUIDv4, UUID } from "@phylopic/utils"
import type { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerHandler } from "aws-lambda"
import { JwtPayload } from "jsonwebtoken"
import isExpired from "../auth/jwt/isExpired"
import verifyJWT from "../auth/jwt/verifyJWT"
export const onAPIGatewayRequestAuthorizer: APIGatewayRequestAuthorizerHandler = async (event, _context) => {
    const uuid = await getAuthorizedUUID(event.headers?.authorization, new Date())
    return {
        policyDocument: {
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: uuid ? "Allow" : "Deny",
                    Resource: "*",
                },
            ],
            Version: "2012-10-17",
        },
        principalId: "token",
    } as APIGatewayAuthorizerResult
}
const getAuthorizedUUID = async (authorization: string | undefined, now: Date): Promise<UUID | null> => {
    try {
        let payload: JwtPayload | null = null
        if (authorization?.match(/^Bearer\s+/)) {
            const jwt = authorization.replace(/^Bearer\s+/, "")
            try {
                payload = await verifyJWT(jwt)
                if (isExpired(payload?.exp, now.valueOf())) {
                    console.warn("Token expired.")
                    return null
                }
            } catch (e) {
                console.error(e)
                return null
            }
        }
        const { sub: uuid } = payload ?? {}
        if (!isUUIDv4(uuid)) {
            console.warn("Unrecognized subject.")
            return null
        }
        return uuid
    } catch (e) {
        console.error(e)
    }
    return null
}
