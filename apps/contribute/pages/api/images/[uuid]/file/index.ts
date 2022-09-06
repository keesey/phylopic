import { handleAPIError } from "@phylopic/source-client"
import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
// import verifyAuthorization from "~/auth/http/verifyAuthorization"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Buffer> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const uuid = req.query.uuid
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        // const imageClient = client.image(uuid)
        // const image = await imageClient.get()
        // await verifyAuthorization(req.headers, { sub: image.contributor })
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const file = await client.image(uuid).file.get()
                res.setHeader("content-type", file.type)
                res.send(file.data)
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
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
