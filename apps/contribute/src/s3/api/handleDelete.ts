import { DeleteObjectCommand, DeleteObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
import { NextApiResponse } from "next"
import checkMetadataBearer from "./checkMetadataBearer"
const handleDelete = async (res: NextApiResponse<string>, client: S3Client, input: DeleteObjectCommandInput) => {
    const output = await client.send(new DeleteObjectCommand(input))
    checkMetadataBearer(output)
    res.status(204)
}
export default handleDelete
