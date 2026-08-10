import { S3Client } from "@aws-sdk/client-s3"
import { isUUIDish, normalizeUUID } from "@phylopic/utils"
import type { NextApiHandler } from "next"
import createS3ClientConfig from "~/aws/createS3ClientConfig"
import loadCollection from "~/permalinks/utils/loadCollection"
import save from "~/permalinks/utils/save"

const index: NextApiHandler = async (req, res) => {
    let s3Client: S3Client | undefined
    try {
        const uuid = req.query.uuid
        if (!isUUIDish(uuid)) {
            res.status(404).end()
            return
        }
        const normalizedUUID = normalizeUUID(uuid)
        const collection = await loadCollection(normalizedUUID)
        s3Client = new S3Client(createS3ClientConfig())
        const hash = await save(s3Client, collection)
        res.setHeader("content-type", "application/json")
        res.status(200).send(JSON.stringify(hash))
    } catch (e) {
        if (typeof e === "number") {
            res.status(e).end()
            return
        }
        console.error("[GET /api/permalinks/collections/[uuid]]", e)
        res.status(502).json({ error: "Could not create a permalink." })
    } finally {
        s3Client?.destroy()
    }
}
export default index
