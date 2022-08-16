import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectOutput,
    PutObjectCommand,
    PutObjectCommandInput,
} from "@aws-sdk/client-s3"
import { Editable } from "../../interfaces/Editable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import S3Reader from "./S3Reader"
export default class S3Editor<T> extends S3Reader<T> implements Editable<T> {
    constructor(
        provider: S3ClientProvider,
        bucket: string,
        key: string,
        readOutput: (output: GetObjectOutput) => Promise<T>,
        protected readonly writeOutput: (value: T) => Promise<Partial<PutObjectCommandInput>>,
    ) {
        super(provider, bucket, key, readOutput)
    }
    public async delete() {
        if (await this.exists()) {
            await this.copyToTrash()
            await this.provider.getS3().send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: this.key,
                }),
            )
        }
    }
    public async put(value: T): Promise<void> {
        if (await this.exists()) {
            await this.copyToTrash()
        }
        await this.provider.getS3().send(
            new PutObjectCommand({
                ...(await this.writeOutput(value)),
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
    }
    protected async copyToTrash() {
        await this.provider.getS3().send(
            new CopyObjectCommand({
                Bucket: this.bucket,
                CopySource: encodeURI(`/${this.bucket}/${this.key}`),
                Key: `trash/${this.key}`,
            }),
        )
    }
}
