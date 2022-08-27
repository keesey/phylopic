import { Listable, Page } from "@phylopic/source-client"
import { NextApiRequest, NextApiResponse } from "next"
const handleWithLister = async <T>(
    req: NextApiRequest,
    res: NextApiResponse<Page<T, number> | number>,
    lister: Listable<T, number>,
) => {
    switch (req.method) {
        case "GET":
        case "HEAD": {
            if (typeof req.query.page === "string") {
                const page = parseInt(req.query.page, 10)
                if (page >= 0 && isFinite(page) && page === Math.floor(page)) {
                    res.json(await lister.page(page))
                } else {
                    throw 400
                }
            } else if (req.query.total === "pages") {
                res.json(await lister.totalPages())
            } else if (req.query.total === "items") {
                res.json(await lister.totalItems())
            } else {
                throw 400
            }
            res.status(200)
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
}
export default handleWithLister
