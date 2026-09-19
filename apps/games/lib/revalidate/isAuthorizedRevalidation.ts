import { timingSafeEqual } from "crypto"

const getBearerToken = (authorization: string | null) => {
    if (!authorization) {
        return null
    }
    const match = authorization.match(/^Bearer\s+(.+)$/i)
    return match?.[1] ?? null
}

const tokensMatch = (provided: string, expected: string) => {
    const providedBuffer = Buffer.from(provided)
    const expectedBuffer = Buffer.from(expected)
    if (providedBuffer.length !== expectedBuffer.length) {
        return false
    }
    return timingSafeEqual(providedBuffer, expectedBuffer)
}

export const isAuthorizedRevalidation = (request: Request) => {
    const token = process.env.REVALIDATE_TOKEN
    if (!token) {
        return false
    }
    const provided = getBearerToken(request.headers.get("authorization"))
    return provided !== null && tokensMatch(provided, token)
}
