import { GetObjectOutput, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3"
import { Patchable } from "../../interfaces"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import { S3Editor } from "./S3Editor"
export class S3Patcher<T> extends S3Editor<T> implements Patchable<T> {
    constructor(
        provider: S3ClientProvider,
        bucket: string,
        key: string,
        readOutput: (output: GetObjectOutput) => Promise<T>,
        writeOutput: (value: T) => Promise<Partial<PutObjectCommandInput>>,
    ) {
        super(provider, bucket, key, readOutput, writeOutput)
    }
    public async patch(value: T): Promise<void> {
        const previous = await this.get()
        await this.put({
            ...previous,
            ...value,
        })
    }
}
