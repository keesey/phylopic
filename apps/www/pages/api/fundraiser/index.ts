import { getFundraiserStatus, isKvReadConfigured } from "@phylopic/fundraiser"
import type { NextApiHandler } from "next"

const CACHE_SECONDS = 30

const index: NextApiHandler = async (req, res) => {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "GET, HEAD, OPTIONS")
        res.status(204)
        return
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.setHeader("Allow", "GET, HEAD, OPTIONS")
        res.status(405).json({ error: "Method not allowed." })
        return
    }
    if (!isKvReadConfigured()) {
        res.status(503).json({ error: "Fundraiser storage is not configured." })
        return
    }
    try {
        const status = await getFundraiserStatus()
        if (!status) {
            res.status(503).json({ error: "Fundraiser storage is not configured." })
            return
        }
        res.setHeader("cache-control", `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`)
        res.setHeader("content-type", "application/json")
        res.status(200)
        if (req.method === "GET") {
            res.send(JSON.stringify(status))
        }
    } catch (error) {
        console.error("[GET /api/fundraiser]", error)
        res.status(502).json({ error: "Could not load fundraiser status." })
    }
}

export default index
