import { GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3"
import { FaultDetector, ValidationFaultCollector } from "@phylopic/utils"
import { Readable } from "stream"
import streamToString from "./streamToString"
export const getJSON = async <T>(client: S3Client, input: GetObjectCommandInput, detect?: FaultDetector<T>) => {
    const command = new GetObjectCommand(input)
    const output = await client.send(command)
    if (output.$metadata.httpStatusCode !== 200) {
        throw new Error("Object not found.")
    }
    const json = await streamToString(output.Body as Readable)
    const object = JSON.parse(json) as T
    const faultCollector = detect ? new ValidationFaultCollector() : undefined
    if (detect && !detect(object, faultCollector)) {
        throw new Error(faultCollector?.list().join("\n\n") || "Invalid object.")
    }
    return [object, output] as Readonly<[T, GetObjectCommandOutput]>
}
export default getJSON
