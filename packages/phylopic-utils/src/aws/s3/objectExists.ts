import { HeadObjectCommand, HeadObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
export const objectExists = async (client: S3Client, input: HeadObjectCommandInput) => {
    const command = new HeadObjectCommand(input)
    try {
        await client.send(command)
    } catch (e) {
        // :TODO: Check if 404
        return false
    }
    return true
}
export default objectExists
