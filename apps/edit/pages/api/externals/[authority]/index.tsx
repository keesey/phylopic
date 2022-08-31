import { handleAPIError, handleWithLister, Page } from "@phylopic/source-client"
import { isAuthority, Namespace } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Namespace, number> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { authority } = req.query
        if (!isAuthority(authority)) {
            throw 404
        }
        client = new SourceClient()
        await handleWithLister(req, res, client.externalNamespaces(authority))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
