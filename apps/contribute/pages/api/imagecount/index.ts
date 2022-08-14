import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import getImageFilter from "~/pagination/getImageFilter"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<number> = async (req, res) => {
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
                client = new SourceClient()
                const total = await client.contributor(contributorUUID).images[filter].totalItems()
                res.setHeader("cache-control", "max-age=30, stale-while-revalidate=86400")
                res.json(total)
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
