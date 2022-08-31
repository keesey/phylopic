import { handleAPIError } from "@phylopic/source-client"
import { isHash, isUUIDv4, normalizeUUID, UUID, ValidationError, ValidationFaultCollector } from "@phylopic/utils"
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
                const { file } = req.query
                const faultCollector = new ValidationFaultCollector(["file"])
                if (!isHash(file, faultCollector)) {
                    throw new ValidationError(faultCollector.list(), "Invalid request.")
                }
                client = new SourceClient()
                if (!(await client.upload(file).exists())) {
                    throw 409
                }
                let uuid: UUID | undefined
                let existing: boolean[]
                do {
                    uuid = normalizeUUID(randomUUID())
                    existing = await Promise.all([client.image(uuid!).exists(), client.submission(uuid!).exists()])
                } while (existing.some(Boolean))
                await client.submission(uuid).put({
                    attribution: null,
                    contributor: sub,
                    created: now.toISOString(),
                    file,
                    identifier: null,
                    license: null,
                    newTaxonName: null,
                    sponsor: null,
                    submitted: false,
                    uuid,
                })
                res.setHeader("cache-control", "no-cache")
                res.setHeader("location", `/edit/${encodeURIComponent(uuid)}/nodes`)
                res.json({ uuid })
                res.status(307)
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
