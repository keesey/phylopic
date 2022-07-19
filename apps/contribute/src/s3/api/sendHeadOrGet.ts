import { GetObjectCommandOutput } from "@aws-sdk/client-s3"
import { convertS3BodyToBuffer } from "@phylopic/utils-aws"
import { NextApiRequest, NextApiResponse } from "next"
import includesETag from "~/auth/http/includesETag"
import checkMetadataBearer from "./checkMetadataBearer"
const sendHeadOrGet = async <T>(req: NextApiRequest, res: NextApiResponse<T>, output: GetObjectCommandOutput) => {
    checkMetadataBearer(output)
    output.CacheControl && res.setHeader("cache-control", output.CacheControl)
    output.ContentLength && res.setHeader("content-length", output.ContentLength)
    output.ContentType && res.setHeader("content-type", output.ContentType)
    output.ETag && res.setHeader("etag", output.ETag)
    if (includesETag(req.headers["if-none-match"], output.ETag)) {
        res.status(304)
    } else {
        res.status(200)
        if (req.method !== "HEAD" && output.Body) {
            try {
                const buffer = await convertS3BodyToBuffer(output.Body)
                res.send(buffer as any)
            } catch (e) {
                console.error(e)
                throw 500
            }
        }
    }
}
export default sendHeadOrGet
