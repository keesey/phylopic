import { handleAPIError, handleWithLister, Page } from "@phylopic/source-client"
import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Page<Image & { uuid: UUID }, number> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        client = new SourceClient()
        await handleWithLister(req, res, client.images, (page: string) => parseInt(page, 10))
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
