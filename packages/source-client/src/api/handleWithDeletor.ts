import type { NextApiRequest, NextApiResponse } from "next"
import type { Deletable } from "../interfaces"

export const handleWithDeletor = async <T>(req: NextApiRequest, res: NextApiResponse<T>, deletor: Deletable<T>) => {
    switch (req.method) {
        case "DELETE": {
            await deletor.delete()
            res.status(204)
            break
        }
        case "GET":
        case "HEAD": {
            res.json(await deletor.get())
            break
        }
        case "OPTIONS": {
            res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PUT")
            res.status(204)
            break
        }
        default: {
            throw 405
        }
    }
}
