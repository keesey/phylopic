import { S3Client } from "@aws-sdk/client-s3"
import { getLineage, isSource, Source, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { getJSON } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
const lineage: NextApiHandler = async (req, res) => {
    if (typeof req.query.uuid !== "string") {
        res.status(404).end()
        return
    }
    const client = new S3Client({})
    try {
        const [source] = await getJSON<Source>(
            client,
            {
                Bucket: SOURCE_BUCKET_NAME,
                Key: "meta.json",
            },
            isSource,
        )
        const lineage = await getLineage(client, req.query.uuid, source.root)
        res.json(lineage)
    } finally {
        client.destroy()
    }
    res.end()
}
export default lineage
