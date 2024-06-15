import { NextApiRequest, NextApiResponse } from "next"
import { Listable, Page } from "../interfaces"
export const handleWithLister = async <T, TPageSpecifier>(
    req: NextApiRequest,
    res: NextApiResponse<Page<T, TPageSpecifier> | number>,
    lister: Listable<T, TPageSpecifier>,
    getPageSpecifier: (queryValue: string) => TPageSpecifier,
) => {
    switch (req.method) {
        case "GET":
        case "HEAD": {
            if (typeof req.query.page === "string") {
                const page = req.query.page ? getPageSpecifier(req.query.page) : undefined
                res.json(await lister.page(page))
            } else if (req.query.total === "pages") {
                res.json(await lister.totalPages())
            } else if (req.query.total === "items") {
                res.json(await lister.totalItems())
            } else {
                res.json(await lister.page())
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
