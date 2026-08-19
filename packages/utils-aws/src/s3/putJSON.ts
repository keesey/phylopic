import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
import { stringifyNormalized } from "@phylopic/utils"
import { S3_SERVER_SIDE_ENCRYPTION_AES256 } from "./S3_SERVER_SIDE_ENCRYPTION_AES256"
export const putJSON = async (
    client: S3Client,
    input: Omit<PutObjectCommandInput, "Body" | "ContentType">,
    o: unknown,
) => {
    const command = new PutObjectCommand({
        ...input,
        ...S3_SERVER_SIDE_ENCRYPTION_AES256,
        Body: stringifyNormalized(o),
        ContentType: "application/json",
    })
    const output = await client.send(command)
    const status = output.$metadata.httpStatusCode
    if (status === undefined || status >= 400) {
        throw new Error(`HTTP Error ${output.$metadata.httpStatusCode}`)
    }
    return output
}
