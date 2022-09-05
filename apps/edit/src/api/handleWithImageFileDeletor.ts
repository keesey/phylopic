import { Deletable, ImageFile } from "@phylopic/source-client"
import { NextApiRequest, NextApiResponse } from "next"
const handleWithImageFileDeletor = async <T>(
    req: NextApiRequest,
    res: NextApiResponse<Buffer>,
    client: Deletable<ImageFile>,
) => {
    const now = new Date()
    switch (req.method) {
        case "DELETE": {
            await client.delete()
            res.status(204)
            break
        }
        case "GET":
        case "HEAD": {
            const { data, type } = await client.get()
            res.setHeader("content-type", type)
            res.send(data)
            res.status(200)
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
export default handleWithImageFileDeletor
