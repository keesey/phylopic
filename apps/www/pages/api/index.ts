import { NextApiHandler } from "next"
const index: NextApiHandler = async (_req, res) => {
    res.redirect(308, "https://api-docs.phylopic.org/v2/index.html")
    res.end()
}
export default index
