import { GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import streamToString from "./streamToString"
export type Validator<T> = (object: T) => void
export const getJSON = async <T>(client: S3Client, input: GetObjectCommandInput, validate?: Validator<T>) => {
    const command = new GetObjectCommand(input)
    const output = await client.send(command)
    if (output.$metadata.httpStatusCode !== 200) {
        throw new Error("Object not found.")
    }
    const json = await streamToString(output.Body as Readable)
    const object = JSON.parse(json) as T
    validate?.(object)
    return [object, output] as Readonly<[T, GetObjectCommandOutput]>
}
export default getJSON
