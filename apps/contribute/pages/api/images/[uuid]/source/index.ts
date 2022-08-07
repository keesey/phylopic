import SourceClient from "@phylopic/source-client"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import handleAPIError from "~/errors/handleAPIError"
const index: NextApiHandler<Buffer> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const { uuid } = req.query
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                client = new SourceClient()
                res.setHeader("cache-control", "max-age=30, stale-while-revalidate=86400")
                const { data, type } = await client.sourceImage(uuid).file.get()
                res.status(200)
                res.setHeader("content-type", type)
                res.send(data)
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
        client?.destroy()
    }
    res.end()
}
export default index
