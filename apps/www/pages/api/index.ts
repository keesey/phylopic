import { NextApiHandler } from "next"
const index: NextApiHandler = async (_req, res) => {
    res.redirect(308, "http://api-docs.phylopic.org/2.0")
    res.end()
}
export default index
