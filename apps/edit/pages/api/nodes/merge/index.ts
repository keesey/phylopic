import { handleAPIError } from "@phylopic/source-client"
import { Submission } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Submission | { uuid: UUID }> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        if (req.method === "POST") {
            const { conserved, suppressed } = req.body ?? {}
            if (!isUUIDv4(conserved) || !isUUIDv4(suppressed)) {
                throw 400
            }
            client = new SourceClient()
            await client.node(conserved).absorb(suppressed)
            res.status(204)
        } else if (req.method === "OPTIONS") {
            res.setHeader("allow", "OPTIONS, POST")
            res.status(204)
        } else {
            throw 405
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
