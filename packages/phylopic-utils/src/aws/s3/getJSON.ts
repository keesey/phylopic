import { GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import streamToString from "./streamToString"
export type Detector<T> = (x: unknown) => x is T
export const getJSON = async <T>(client: S3Client, input: GetObjectCommandInput, detect?: Detector<T>) => {
    const command = new GetObjectCommand(input)
    const output = await client.send(command)
    if (output.$metadata.httpStatusCode !== 200) {
        throw new Error("Object not found.")
    }
    const json = await streamToString(output.Body as Readable)
    const object = JSON.parse(json) as T
    if (!detect?.(object)) {
        throw new Error("JSON does not represent the expected model.")
    }
    return [object, output] as Readonly<[T, GetObjectCommandOutput]>
}
export default getJSON
