import { NextApiHandler } from "next"
const index: NextApiHandler = async (_req, res) => {
    res.redirect(308, "https://api-docs.phylopic.org/")
    res.end()
}
export default index
