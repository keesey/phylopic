import {
    GetObjectCommand,
    GetObjectCommandInput,
    HeadObjectCommand,
    HeadObjectCommandInput,
    S3Client,
} from "@aws-sdk/client-s3"
import { NextApiRequest, NextApiResponse } from "next"
import sendHeadOrGet from "./sendHeadOrGet"
const handleHeadOrGet = async <T>(
    req: NextApiRequest,
    res: NextApiResponse<T>,
    client: S3Client,
    input: GetObjectCommandInput | HeadObjectCommandInput,
) => {
    const output = await client.send(req.method !== "HEAD" ? new GetObjectCommand(input) : new HeadObjectCommand(input))
    await sendHeadOrGet(req, res, output)
}
export default handleHeadOrGet
