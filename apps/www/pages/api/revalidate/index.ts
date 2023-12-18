import { NextApiHandler } from "next"
const index: NextApiHandler = async (req, res) => {
    if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
        return res.status(401).json({ message: "Invalid secret token." })
    }
    if (typeof req.query.path !== "string") {
        return res.status(400).json({ message: "No path provided." })
    }
    try {
        await res.revalidate(req.query.path)
        return res.json({ revalidated: true })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: String(err) })
    }
}
export default index
