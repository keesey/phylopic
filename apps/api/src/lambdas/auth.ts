import { isUUIDv4, UUID } from "@phylopic/utils"
import type { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerHandler } from "aws-lambda"
import { JwtPayload } from "jsonwebtoken"
import isExpired from "../auth/jwt/isExpired"
import verifyJWT from "../auth/jwt/verifyJWT"
export const onAPIGatewayRequestAuthorizer: APIGatewayRequestAuthorizerHandler = async (event, _context) => {
    const uuid = await getAuthorizedUUID(event.headers?.authorization ?? event.headers?.Authorization, new Date())
    return {
        // Passed through to the authorized function as `event.requestContext.authorizer.uuid`.
        // This is the only place a token's signature is checked, so downstream functions must
        // take the caller's identity from here rather than reading the token themselves.
        context: uuid ? { uuid } : undefined,
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
        principalId: uuid ?? "anonymous",
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
