import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
export const putJSONString = async (
    client: S3Client,
    input: Omit<PutObjectCommandInput, "Body" | "ContentType">,
    body: string,
) => {
    const command = new PutObjectCommand({
        ...input,
        Body: body,
        ContentType: "application/json",
    })
    const output = await client.send(command)
    const status = output.$metadata.httpStatusCode
    if (status === undefined || status >= 400) {
        throw new Error(`HTTP Error ${output.$metadata.httpStatusCode}`)
    }
    return output
}
