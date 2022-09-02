import { NextApiRequest, NextApiResponse } from "next"
import { Editable } from "../interfaces"
export const handleWithEditor = async <T>(req: NextApiRequest, res: NextApiResponse<T>, editor: Editable<T>) => {
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
            res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PUT")
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
export default handleWithEditor
