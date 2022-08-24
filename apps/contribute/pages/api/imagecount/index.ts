import { isUUIDv4 } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleAPIError from "~/errors/handleAPIError"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<{ accepted: number; incomplete: number; submitted: number; withdrawn: number }> = async (
    req,
    res,
) => {
    let client: SourceClient | undefined
    try {
        const { sub: contributorUUID } = (await verifyAuthorization(req.headers)) ?? {}
        if (!contributorUUID) {
            throw 401
        }
        if (!isUUIDv4(contributorUUID)) {
            throw 403
        }
        switch (req.method) {
            case "GET":
            case "HEAD": {
                client = new SourceClient()
                res.json({
                    accepted: await client.contributor(contributorUUID).images.accepted.totalItems(),
                    incomplete: await client.contributor(contributorUUID).images.incomplete.totalItems(),
                    submitted: await client.contributor(contributorUUID).images.submitted.totalItems(),
                    withdrawn: await client.contributor(contributorUUID).images.withdrawn.totalItems(),
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
        await client?.destroy()
    }
    res.end()
}
export default index
