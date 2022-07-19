import { S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { isEmailAddress } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import handleHeadOrGet from "~/s3/api/handleHeadOrGet"
import getContributorMetaKey from "~/s3/keys/contribute/getContributorMetaKey"
const index: NextApiHandler<string | null> = async (req, res) => {
    try {
        const email = req.query.email
        if (!isEmailAddress(email)) {
            throw 404
        }
        verifyAuthorization(req.headers, email)
        switch (req.method) {
            case "GET":
            case "HEAD": {
                const client = new S3Client({})
                try {
                    await handleHeadOrGet(req, res, client, {
                        Bucket: CONTRIBUTE_BUCKET_NAME,
                        Key: getContributorMetaKey(email),
                    })
                } finally {
                    client.destroy()
                }
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "GET, HEAD, OPTIONS, PATCH, PUT")
                res.setHeader("cache-control", "max-age=3600")
                res.setHeader("date", new Date().toUTCString())
                res.status(204)
                break
            }
            default: {
                throw 405
            }
        }
    } catch (e) {
        if (typeof e === "number") {
            res.status(e)
        } else {
            console.error(e)
            res.status(500)
        }
    }
    res.end()
}
export default index
