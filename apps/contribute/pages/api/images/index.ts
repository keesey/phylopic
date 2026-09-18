import { handleAPIError, handleWithLister, type Page } from "@phylopic/source-client"
import type { Image } from "@phylopic/source-models"
import { isUUIDv4, type UUID } from "@phylopic/utils"
import type { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import SourceClient from "~/source/SourceClient"

const index: NextApiHandler<Page<Image & { uuid: UUID }, number> | number> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { sub: contributorUUID } = (await verifyAuthorization(req.headers)) ?? {}
        if (!isUUIDv4(contributorUUID)) {
            throw 403
        }
        client = new SourceClient()
        await handleWithLister(req, res, client.contributor(contributorUUID).images, (page: string) =>
            parseInt(page, 10),
        )
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}

export default index
