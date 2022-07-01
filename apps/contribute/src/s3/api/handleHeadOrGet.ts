import {
    GetObjectCommand,
    GetObjectCommandInput,
    HeadObjectCommand,
    HeadObjectCommandInput,
    S3Client,
} from "@aws-sdk/client-s3"
import { NextApiRequest, NextApiResponse } from "next"
import checkMetadataBearer from "./checkMetadataBearer"
import sendHeadOrGet from "./sendHeadOrGet"
const handleHeadOrGet = async (
    req: NextApiRequest,
    res: NextApiResponse<string>,
    client: S3Client,
    input: GetObjectCommandInput | HeadObjectCommandInput,
) => {
    const output = await client.send(req.method === "GET" ? new GetObjectCommand(input) : new HeadObjectCommand(input))
    sendHeadOrGet(req, res, output)
}
export default handleHeadOrGet
