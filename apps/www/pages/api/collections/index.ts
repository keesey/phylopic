import { DATA_MEDIA_TYPE, Link } from "@phylopic/api-models"
import { isUUIDish } from "@phylopic/utils"
import axios from "axios"
import type { NextApiHandler } from "next"

const index: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST")
        res.status(405).end()
        return
    }
    if (!Array.isArray(req.body)) {
        res.status(400).json({ error: "Expected a JSON array of image UUIDs." })
        return
    }
    try {
        const response = await axios.post<Link>(`${process.env.NEXT_PUBLIC_API_URL}/collections`, req.body, {
            headers: {
                Accept: DATA_MEDIA_TYPE,
                "Content-Type": "application/json",
            },
            maxRedirects: 0,
            validateStatus: status => status === 303,
        })
        const segment = response.data?.href?.split("/").pop()
        if (!segment || !isUUIDish(segment)) {
            res.status(502).json({ error: "Unexpected response from the collections API." })
            return
        }
        res.status(200).json({ uuid: segment })
    } catch (e) {
        console.error("[POST /api/collections]", e)
        res.status(502).json({ error: "Could not create a collection page." })
    }
}

export default index
