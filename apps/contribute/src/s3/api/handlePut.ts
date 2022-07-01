import {
    DeleteObjectCommand,
    DeleteObjectCommandInput,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
} from "@aws-sdk/client-s3"
import { NextApiResponse } from "next"
import checkMetadataBearer from "./checkMetadataBearer"
const handlePut = async (
    res: NextApiResponse<string>,
    client: S3Client,
    input: PutObjectCommandInput,
    deleteInput?: DeleteObjectCommandInput,
) => {
    if (deleteInput) {
        await client.send(new DeleteObjectCommand(deleteInput))
    }
    const output = await client.send(new PutObjectCommand(input))
    checkMetadataBearer(output)
    output.ETag && res.setHeader("etag", output.ETag)
    res.status(204)
}
export default handlePut
