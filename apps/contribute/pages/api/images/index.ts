import { Image } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { NextApiHandler, NextApiRequest } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import SourceClient from "~/source/SourceClient"
const getFilter = (query: NextApiRequest["query"]): "accepted" | "submitted" | "withdrawn" => {
    const filter = query.filter
    if (filter === "accepted" || filter === "withdrawn") {
        return filter
    }
    return "submitted"
}
const getPageIndex = (query: NextApiRequest["query"]): number => {
    if (typeof query.page === "string") {
        return parseInt(query.page, 10) ?? 0
    }
    return 0
}
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
                const filter = getFilter(req.query)
                const pageIndex = getPageIndex(req.query)
                client = new SourceClient()
                const page = await client.contributor(contributorUUID).images[filter].page(pageIndex)
                res.setHeader("cache-control", "max-age=30, stale-while-revalidate=86400")
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
