import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectOutput,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
} from "@aws-sdk/client-s3"
import { Editable } from "../interfaces"
import Reader from "./Reader"
export default class Editor<T> extends Reader<T> implements Editable<T> {
    constructor(
        getClient: () => S3Client,
        bucket: string,
        key: string,
        readOutput: (output: GetObjectOutput) => Promise<T>,
        protected writeOutput: (value: T) => Promise<Partial<PutObjectCommandInput>>,
    ) {
        super(getClient, bucket, key, readOutput)
    }
    public async delete() {
        await this.getClient().send(
            new CopyObjectCommand({
                Bucket: this.bucket,
                CopySource: `${this.bucket}/${this.key}`,
                Key: `trash/${this.key}`,
            }),
        )
        await this.getClient().send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
    }
    public async put(value: T): Promise<void> {
        await this.getClient().send(
            new PutObjectCommand({
                ...(await this.writeOutput(value)),
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
    }
}
