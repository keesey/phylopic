import { TedisPool } from "tedis"
import { RedisService } from "../../services/RedisService"
let pool: TedisPool | undefined
const REDIS_SERVICE: RedisService = {
    async getRedisClient() {
        if (process.env.REDIS_SEARCH_HOST && process.env.REDIS_SEARCH_HOST !== "-") {
            try {
                return (
                    pool ??
                    (pool = new TedisPool({
                        host: process.env.REDIS_SEARCH_HOST,
                        port: process.env.REDIS_SEARCH_PORT ? parseInt(process.env.REDIS_SEARCH_PORT, 10) : 6379,
                    }))
                ).getTedis()
            } catch (e) {
                console.warn(e)
            }
        }
    },
}
export default REDIS_SERVICE
