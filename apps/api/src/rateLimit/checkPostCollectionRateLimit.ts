const WINDOW_MS = 60 * 60 * 1000
const IP_LIMIT = 30

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

export const checkPostCollectionRateLimit = (ip: string): boolean => increment(`ip:${ip}`, IP_LIMIT)
