import { NextApiRequest, NextApiResponse } from "next"
import { Patchable } from "../interfaces"
export const handleWithPatcher = async <T>(req: NextApiRequest, res: NextApiResponse<T>, editor: Patchable<T>) => {
    switch (req.method) {
        case "DELETE": {
            await editor.delete()
            res.status(204)
            break
        }
        case "GET":
        case "HEAD": {
            res.json(await editor.get())
            break
        }
        case "OPTIONS": {
            res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PATCH, PUT")
            res.status(204)
            break
        }
        case "PATCH": {
            await editor.patch(req.body)
            res.status(204)
            break
        }
        case "PUT": {
            await editor.put(req.body)
            res.status(204)
            break
        }
        default: {
            throw 405
        }
    }
}
