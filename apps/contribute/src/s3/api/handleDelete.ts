import { CopyObjectCommand, DeleteObjectCommand, DeleteObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
import { NextApiResponse } from "next"
const handleDelete = async (res: NextApiResponse<string>, client: S3Client, input: DeleteObjectCommandInput) => {
    await client.send(new CopyObjectCommand({
        Bucket: input.Bucket,
        CopySource: `${input.Bucket}.${input.Key}`,
        Key: `trash/${input.Key}`,
    }))
    await client.send(new DeleteObjectCommand(input))
    res.status(204)
}
export default handleDelete
