import { GetObjectOutput, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
import { Patchable } from "../interfaces"
import Editor from "./Editor"
export default class Patcher<T> extends Editor<T> implements Patchable<T> {
    constructor(
        getClient: () => S3Client,
        bucket: string,
        key: string,
        readOutput: (output: GetObjectOutput) => Promise<T>,
        writeOutput: (value: T) => Promise<Partial<PutObjectCommandInput>>,
    ) {
        super(getClient, bucket, key, readOutput, writeOutput)
    }
    public async patch(value: Partial<T>) {
        const existing = await this.get()
        await this.put({
            ...existing,
            ...value,
        })
    }
}
