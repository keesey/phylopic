import SourceClient from "@phylopic/source-client"
import { isDefined, isUUIDv4, stringifyNormalized, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import { UUIDList } from "~/models/UUIDList"
const index: NextApiHandler<UUIDList> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const payload = await verifyAuthorization(req.headers)
        const contributorUUID = payload?.sub
        if (!isUUIDv4(contributorUUID)) {
            throw 401
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                let token = typeof req.query.token === "string" ? req.query.token : undefined
                let uuids: UUID[]
                client = new SourceClient()
                do {
                    const list = await client.sourceImages(token)
                    const imageUUIDPromises = list.items.map(async uuid => {
                        const image = await client?.sourceImage(uuid).get()
                        if (image?.contributor === contributorUUID) {
                            return uuid
                        }
                    })
                    uuids = (await Promise.all(imageUUIDPromises)).filter(isDefined)
                    token = list.nextToken
                } while (!uuids.length && token)
                res.setHeader("cache-control", "max-age=30, stale-while-revalidate=86400")
                res.json({
                    nextToken: token,
                    uuids,
                })
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
