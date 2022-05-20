import { S3Client } from "@aws-sdk/client-s3"
import { isNode, Node, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isUUID, normalizeUUID, UUID } from "@phylopic/utils"
import { getJSON, putJSON } from "@phylopic/utils-aws"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

const get = async (client: S3Client, uuid: UUID, res: NextApiResponse<Node>) => {
    try {
        const [node] = await getJSON<Node>(
            client,
            {
                Bucket: SOURCE_BUCKET_NAME,
                Key: `nodes/${uuid}/meta.json`,
            },
            isNode,
        )
        return res.json(node)
    } catch (e) {
        console.error(e)
        // :TODO: check status
        return res.status(404).end()
    }
}
const put = async (client: S3Client, req: NextApiRequest, res: NextApiResponse<void>) => {
    if (!isNode(req.body)) {
        res.status(400).end()
        return
    }
    // :TODO: validate parent
    await putJSON(
        client,
        {
            Bucket: SOURCE_BUCKET_NAME,
            Key: `nodes/${normalizeUUID(String(req.query.uuid))}/meta.json`,
        },
        req.body,
    )
    res.status(204).end()
}
const nodes: NextApiHandler = async (req, res) => {
    if (!isUUID(req.query.uuid)) {
        console.error("Missing or invalid UUID.")
        res.status(400).end()
    } else {
        const client = new S3Client({})
        try {
            switch (req.method) {
                case "GET": {
                    await get(client, normalizeUUID(req.query.uuid), res)
                    break
                }
                case "PUT": {
                    await put(client, req, res)
                    break
                }
                default: {
                    res.status(405).end()
                }
            }
        } finally {
            client.destroy()
        }
    }
}
export default nodes
