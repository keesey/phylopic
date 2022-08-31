import { handleAPIError } from "@phylopic/source-client"
import { isUUIDv4, normalizeUUID, UUID } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<{ uuid: UUID }> = async (req, res) => {
    const now = new Date()
    let client: SourceClient | undefined
    try {
        const { sub } = (await verifyAuthorization(req.headers)) ?? {}
        if (!isUUIDv4(sub)) {
            throw 403
        }
        switch (req.method) {
            case "OPTIONS": {
                res.setHeader("allow", "OPTIONS, POST")
                res.status(204)
                break
            }
            case "POST": {
                client = new SourceClient()
                let uuid: UUID | undefined
                let existing: boolean[]
                do {
                    uuid = normalizeUUID(randomUUID())
                    existing = await Promise.all([client.image(uuid!).exists(), client.submission(uuid!).exists()])
                } while (existing.some(Boolean))
                res.setHeader("cache-control", "no-cache")
                res.json({ uuid })
                res.status(200)
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
