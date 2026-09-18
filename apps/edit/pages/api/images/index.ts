import { handleAPIError, handleWithLister, type Page } from "@phylopic/source-client"
import type { Image } from "@phylopic/source-models"
import type { UUID } from "@phylopic/utils"
import type { NextApiHandler } from "next"
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
