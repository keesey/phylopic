import { Page } from "@phylopic/source-client"
import { Authority } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/api/handleAPIError"
import handleWithLister from "~/api/handleWithLister"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Authority, number> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        client = new SourceClient()
        await handleWithLister(req, res, client.externalAuthorities)
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
