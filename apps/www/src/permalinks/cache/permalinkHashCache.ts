import { Hash } from "@phylopic/utils"

const CACHE_TTL_MS = 60 * 60 * 1000

const cache = new Map<string, { expiresAt: number; hash: Hash }>()

const cacheKey = (uuid: string, build: number) => `${uuid}:${build}`

export const getCachedPermalinkHash = (uuid: string, build: number): Hash | undefined => {
    const entry = cache.get(cacheKey(uuid, build))
    if (!entry || entry.expiresAt <= Date.now()) {
        if (entry) {
            cache.delete(cacheKey(uuid, build))
        }
        return undefined
    }
    return entry.hash
}

export const setCachedPermalinkHash = (uuid: string, build: number, hash: Hash) => {
    cache.set(cacheKey(uuid, build), {
        expiresAt: Date.now() + CACHE_TTL_MS,
        hash,
    })
}
