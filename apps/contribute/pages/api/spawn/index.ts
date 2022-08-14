import { Editable } from "@phylopic/source-client"
import { Image } from "@phylopic/source-models"
import { isUUIDv4, normalizeUUID, UUID } from "@phylopic/utils"
import { randomUUID } from "crypto"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import MAX_INCOMPLETE_IMAGES from "~/editing/MAX_INCOMPLETE_IMAGES"
import handleAPIError from "~/errors/handleAPIError"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<{ existing: boolean; uuid: UUID }> = async (req, res) => {
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
                const existing = await client.contributor(sub).images.incomplete.page()
                let uuid: UUID | undefined
                if (existing.items[0]) {
                    for (const item of existing.items) {
                        if (!(await client.image(item.uuid).file.exists())) {
                            uuid = item.uuid
                            break
                        }
                    }
                    if (uuid) {
                        res.json({ existing: true, uuid })
                    } else if (existing.items.length >= MAX_INCOMPLETE_IMAGES) {
                        uuid = existing.items[0].uuid
                        res.json({ existing: true, uuid })
                    }
                }
                if (!uuid) {
                    let imageClient: Editable<Image & { uuid: UUID }>
                    do {
                        uuid = normalizeUUID(randomUUID())
                        imageClient = client.image(uuid)
                    } while (await imageClient.exists())
                    await imageClient.put({
                        accepted: false,
                        attribution: null,
                        contributor: sub,
                        created: now.toISOString(),
                        general: null,
                        license: null,
                        modified: now.toISOString(),
                        specific: null,
                        sponsor: null,
                        submitted: false,
                        uuid,
                    })
                    res.json({ existing: false, uuid })
                }
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
