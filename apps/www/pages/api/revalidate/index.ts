import { NextApiHandler } from "next"
const index: NextApiHandler = async (req, res) => {
    const token = process.env.REVALIDATE_TOKEN
    // Fail closed when unset: otherwise `undefined !== undefined` would authorize anyone.
    if (!token || req.query.secret !== token) {
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
