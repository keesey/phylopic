import { handleAPIError, handleWithLister, Page, S3Entry } from "@phylopic/source-client"
import { Hash, ISOTimestamp } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<{ Key: Hash; LastModified?: ISOTimestamp }, string> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        client = new SourceClient()
        await handleWithLister<S3Entry<Hash>, string>(req, res, client.submissions, (page: string) => page)
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
