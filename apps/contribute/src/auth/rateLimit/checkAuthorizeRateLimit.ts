const WINDOW_MS = 60 * 60 * 1000
const IP_LIMIT = 20
const EMAIL_LIMIT = 5

const buckets = new Map<string, { count: number; expiresAt: number }>()

const increment = (key: string, limit: number): boolean => {
    const now = Date.now()
    const entry = buckets.get(key)
    if (!entry || entry.expiresAt <= now) {
        buckets.set(key, { count: 1, expiresAt: now + WINDOW_MS })
        return true
    }
    if (entry.count >= limit) {
        return false
    }
    entry.count++
    return true
}

export const getClientIp = (forwardedFor: string | string[] | undefined): string => {
    const value = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
    return value?.split(",")[0]?.trim() || "unknown"
}

export const checkAuthorizeRateLimit = (ip: string, email: string): boolean =>
    increment(`ip:${ip}`, IP_LIMIT) && increment(`email:${email.toLowerCase()}`, EMAIL_LIMIT)
