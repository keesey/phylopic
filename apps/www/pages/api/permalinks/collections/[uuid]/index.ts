import { S3Client } from "@aws-sdk/client-s3"
import { isUUIDish, normalizeUUID } from "@phylopic/utils"
import { NextApiHandler } from "next"
import loadCollection from "~/permalinks/utils/loadCollection"
import save from "~/permalinks/utils/save"
const index: NextApiHandler = async (req, res) => {
    let s3Client: S3Client | undefined
    try {
        const uuid = req.query.uuid
        if (!isUUIDish(uuid)) {
            throw 404
        }
        const normalizedUUID = normalizeUUID(uuid)
        const collection = await loadCollection(normalizedUUID)
        s3Client = new S3Client({})
        const hash = await save(s3Client, collection)
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(hash))
        res.status(200)
        res.end()
    } catch (e) {
        if (typeof e === "number") {
            res.status(e)
            res.end()
        } else {
            throw e
        }
    } finally {
        s3Client?.destroy()
    }
}
export default index
