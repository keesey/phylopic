import { ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client } from "@aws-sdk/client-s3"
import { NextApiHandler, NextApiResponse } from "next"
import { EmailAddress, isEmailAddress, isUUID } from "@phylopic/utils"
import { post as postSubmission } from "./[uuid]/approve"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
const post = async (client: S3Client, contributor: EmailAddress, res: NextApiResponse) => {
    let listResponse: ListObjectsV2CommandOutput | undefined
    const listPrefix = `contributors/${encodeURIComponent(contributor)}/images/`
    do {
        listResponse = await client.send(
            new ListObjectsV2Command({
                Bucket: CONTRIBUTE_BUCKET_NAME,
                ContinuationToken: listResponse?.NextContinuationToken,
                Delimiter: "/",
                Prefix: listPrefix,
            }),
        )
        if (listResponse.CommonPrefixes) {
            for (const prefix of listResponse.CommonPrefixes) {
                if (prefix?.Prefix) {
                    const uuid = prefix.Prefix.replace(listPrefix, "").replace(/\/$/, "")
                    if (!isUUID(uuid)) {
                        console.warn(`Not a UUID: <${uuid}>.`)
                    } else {
                        await postSubmission(client, contributor, uuid, res)
                        if (res.statusCode >= 400) {
                            return
                        }
                    }
                }
            }
        }
    } while (listResponse.NextContinuationToken)
}
const approve: NextApiHandler<void> = async (req, res) => {
    const { contributor } = req.query
    if (!isEmailAddress(contributor)) {
        console.error("Missing or invalid contributor.")
        res.status(404).end()
    } else {
        switch (req.method) {
            case "POST": {
                const client = new S3Client({})
                try {
                    await post(client, contributor, res)
                    if (!(res.statusCode >= 400)) {
                        res.status(204)
                    }
                } finally {
                    client.destroy()
                }
                break
            }
            default: {
                res.status(405)
            }
        }
    }
    res.end()
}
export default approve
