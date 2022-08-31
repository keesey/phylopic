import { GetObjectOutput, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3"
import { Patchable } from "../../interfaces"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import S3Editor from "./S3Editor"
export default class S3Patcher<T> extends S3Editor<T> implements Patchable<T> {
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
        const next = {
            ...previous,
            ...value,
        }
        await this.provider.getS3().send(
            new PutObjectCommand({
                ...(await this.writeOutput(next)),
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
    }
}
