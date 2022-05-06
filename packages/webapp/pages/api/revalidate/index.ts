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
        return res.status(401).json({ message: "Invalid token." })
    }
    try {
        const results = await Promise.allSettled(PATHS_TO_REVALIDATE.map(path => res.unstable_revalidate(path)))
        const reasons: unknown[] = []
        for (const result of results) {
            if (result.status === "rejected") {
                console.error(result.reason)
                reasons.push(result.reason)
            }
        }
        if (reasons.length > 0) {
            throw new Error(`Failed to revalidate ${reasons.length} out of ${PATHS_TO_REVALIDATE.length} paths.`)
        }
        return res.json({ revalidated: true })
    } catch (err) {
        console.error(err)
        return res.status(500).send(String(err))
    }
}
export default index
