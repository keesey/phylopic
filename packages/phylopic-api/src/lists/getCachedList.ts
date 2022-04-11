import { PoolClient } from "pg"
import { Tedis } from "tedis"
import { PoolService } from "../services/PoolService"
import { RedisService } from "../services/RedisService"
export interface Params {
    readonly fallback: {
        all: (client: PoolClient) => Promise<readonly string[]>
        slice?: (client: PoolClient) => Promise<readonly string[]>
        total?: (client: PoolClient) => Promise<number>
    }
    readonly href: string
    readonly length: number
    readonly service: PoolService & RedisService
    readonly start: number
}
const getCachedList = async ({
    fallback,
    length,
    href,
    service,
    start,
}: Params): Promise<Readonly<[readonly string[], number]>> => {
    const key = parseInt(process.env.PHYLOPIC_BUILD ?? "0", 10).toString(36) + "#" + href
    let poolClient: PoolClient | undefined
    let redisClient: Tedis | undefined
    let result: Readonly<[readonly string[], number]>
    try {
        redisClient = await service.getRedisClient()
        if (redisClient && (await redisClient.exists(key))) {
            const [items, total] = await Promise.all([
                redisClient.zrange(key, start, start + length),
                redisClient.zcard(key),
            ])
            result = [items, total]
        } else {
            poolClient = await service.getPoolClient()
            if (redisClient || !fallback.slice || !fallback.total) {
                const items = await fallback.all(poolClient)
                const objMS = items.reduce<Record<string, number>>(
                    (prev, value, index) => ({ ...prev, [value]: index }),
                    {},
                )
                // :TODO: try removing the await.
                await redisClient?.zadd(key, objMS)
                result = [items.slice(start, start + length), items.length]
            } else {
                result = await Promise.all([fallback.slice(poolClient), fallback.total(poolClient)])
            }
        }
    } finally {
        poolClient?.release()
        redisClient?.close()
    }
    return result
}
export default getCachedList
