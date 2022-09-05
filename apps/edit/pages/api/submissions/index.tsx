import { handleAPIError, handleWithLister, Page } from "@phylopic/source-client"
import { Hash } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Hash, string> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        client = new SourceClient()
        await handleWithLister(req, res, client.submissions, (page: string) => page)
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
