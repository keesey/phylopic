import { handleAPIError, handleWithLister, Page } from "@phylopic/source-client"
import { Submission } from "@phylopic/source-models"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Submission & { Key: string }, string> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { sub: contributorUUID } = (await verifyAuthorization(req.headers)) ?? {}
        if (!isUUIDv4(contributorUUID)) {
            throw 403
        }
        client = new SourceClient()
        await handleWithLister(req, res, client.contributor(contributorUUID).submissions, (page: string) => page)
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
