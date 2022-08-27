import { Page } from "@phylopic/source-client"
import { Contributor } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/api/handleAPIError"
import handleWithLister from "~/api/handleWithLister"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Contributor & { uuid: UUID }, number> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        client = new SourceClient()
        await handleWithLister(req, res, client.contributors)
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index