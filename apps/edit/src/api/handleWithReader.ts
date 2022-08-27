import { Readable } from "@phylopic/source-client"
import { NextApiRequest, NextApiResponse } from "next"
const handleWithReader = async <T>(req: NextApiRequest, res: NextApiResponse<T>, reader: Readable<T>) => {
    switch (req.method) {
        case "GET":
        case "HEAD": {
            res.json(await reader.get())
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
export default handleWithReader
