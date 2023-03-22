import { NextApiHandler } from "next"
const index: NextApiHandler = async (_req, res) => {
    res.redirect(308, "http://api-docs.phylopic.org/v2")
    res.end()
}
export default index
