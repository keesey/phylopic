import { GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3"
import { FaultDetector, ValidationFaultCollector } from "@phylopic/utils"
import { convertS3BodyToString } from "./convertS3BodyToString"
export const getJSON = async <T>(client: S3Client, input: GetObjectCommandInput, detect?: FaultDetector<T>) => {
    const command = new GetObjectCommand(input)
    const output = await client.send(command)
    const json = await convertS3BodyToString(output.Body)
    const object = JSON.parse(json) as T
    if (detect) {
        const faultCollector = new ValidationFaultCollector()
        if (!detect(object, faultCollector)) {
            throw new Error(
                `Error in file s3://${input.Bucket}/${input.Key}:` +
                    (faultCollector
                        ?.list()
                        .map(fault => `${fault.message} ${fault.field ? `[${fault.field}]` : ""}`)
                        .join("\n\n") || "Invalid object."),
            )
        }
    }
    return [object, output] as Readonly<[T, GetObjectCommandOutput]>
}
