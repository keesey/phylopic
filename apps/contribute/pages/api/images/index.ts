import { Image } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import getImageFilter from "~/pagination/getImageFilter"
import getPageIndex from "~/pagination/getPageIndex"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<{ items: ReadonlyArray<Image & { uuid: UUID }>; next?: number }> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { sub: contributorUUID } = (await verifyAuthorization(req.headers)) ?? {}
        if (!isUUIDv4(contributorUUID)) {
            throw 403
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const filter = getImageFilter(req.query)
                const pageIndex = getPageIndex(req.query)
                client = new SourceClient()
                const page = await client.contributor(contributorUUID).images[filter].page(pageIndex)
                res.json(page)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS")
                res.status(204)
                break
            }
            default: {
                throw 405
            }
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
