import { S3Client } from "@aws-sdk/client-s3"
import { Hash, isUUIDish, normalizeUUID } from "@phylopic/utils"
import type { NextApiHandler } from "next"
import createS3ClientConfig from "~/aws/createS3ClientConfig"
import getClientIp from "~/http/getClientIp"
import { getCachedPermalinkHash, setCachedPermalinkHash } from "~/permalinks/cache/permalinkHashCache"
import checkPermalinkRateLimit from "~/permalinks/rateLimit/checkPermalinkRateLimit"
import loadCollection from "~/permalinks/utils/loadCollection"
import getBuild from "~/permalinks/utils/getBuild"
import save from "~/permalinks/utils/save"

const PERMALINK_CACHE_CONTROL = "public,max-age=3600,stale-while-revalidate=86400"

const sendHash = (res: Parameters<NextApiHandler>[1], hash: Hash, method: string | undefined) => {
    res.setHeader("cache-control", PERMALINK_CACHE_CONTROL)
    res.setHeader("content-type", "application/json")
    res.status(200)
    if (method === "GET") {
        res.send(JSON.stringify(hash))
    }
}

const index: NextApiHandler = async (req, res) => {
    let s3Client: S3Client | undefined
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "GET, HEAD, OPTIONS")
            res.status(204)
            return
        }
        if (req.method !== "GET" && req.method !== "HEAD") {
            res.setHeader("allow", "GET, HEAD, OPTIONS")
            res.status(405)
            return
        }
        const uuid = req.query.uuid
        if (!isUUIDish(uuid)) {
            res.status(404).end()
            return
        }
        const normalizedUUID = normalizeUUID(uuid)
        const ip = getClientIp(req.headers["x-forwarded-for"])
        if (!checkPermalinkRateLimit(ip, normalizedUUID)) {
            res.setHeader("retry-after", "3600")
            res.status(429).json({ error: "Too many permalink requests." })
            return
        }
        const build = await getBuild()
        const cachedHash = getCachedPermalinkHash(normalizedUUID, build)
        if (cachedHash) {
            sendHash(res, cachedHash, req.method)
            return
        }
        const collection = await loadCollection(normalizedUUID, build)
        s3Client = new S3Client(createS3ClientConfig())
        const hash = await save(s3Client, collection)
        setCachedPermalinkHash(normalizedUUID, build, hash)
        sendHash(res, hash, req.method)
    } catch (e) {
        if (typeof e === "number") {
            res.status(e).end()
            return
        }
        console.error("[GET /api/permalinks/collections/[uuid]]", e)
        res.status(502).json({ error: "Could not create a permalink." })
    } finally {
        s3Client?.destroy()
    }
}
export default index
