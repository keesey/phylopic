import { NextApiHandler } from "next"
const PATHS_TO_REVALIDATE = [
    "/",
    "/contributors",
    "/contributors/[email]",
    "/images",
    "/images/[uuid]",
    "/nodes",
    "/nodes/[uuid]",
    "/nodes/[uuid]/lineage",
    "/thanks",
]
const index: NextApiHandler = async (req, res) => {
    if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
        return res.status(401).json({ message: "Invalid secret token." })
    }
    try {
        const results = await Promise.allSettled(PATHS_TO_REVALIDATE.map(path => res.revalidate(path)))
        let revalidated = true
        for (const result of results) {
            if (result.status === "rejected") {
                console.error(result.reason)
                revalidated = false
            }
        }
        return res.json({ revalidated })
    } catch (err) {
        console.error(err)
        return res.status(500).send(String(err))
    }
}
export default index
