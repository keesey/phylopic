import { GetObjectCommandOutput } from "@aws-sdk/client-s3"
import { streamToString } from "@phylopic/utils-aws"
import { NextApiRequest, NextApiResponse } from "next"
import { Readable } from "stream"
import includesETag from "~/auth/http/includesETag"
import checkMetadataBearer from "./checkMetadataBearer"
const sendHeadOrGet = async (req: NextApiRequest, res: NextApiResponse<string>, output: GetObjectCommandOutput) => {
    checkMetadataBearer(output)
    output.CacheControl && res.setHeader("cache-control", output.CacheControl)
    output.ContentLength && res.setHeader("content-length", output.ContentLength)
    output.ContentType && res.setHeader("content-type", output.ContentType)
    output.ETag && res.setHeader("etag", output.ETag)
    if (includesETag(req.headers["if-none-match"], output.ETag)) {
        res.status(304)
    } else {
        res.status(200)
        if (req.method === "GET") {
            res.send(await streamToString(output.Body as Readable))
        }
    }
}
export default sendHeadOrGet
