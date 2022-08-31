import { CopyObjectCommand, DeleteObjectCommand, GetObjectOutput } from "@aws-sdk/client-s3"
import { Deletable } from "../../interfaces/Deletable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import S3Reader from "./S3Reader"
export default class S3Deletor<T> extends S3Reader<T> implements Deletable<T> {
    constructor(
        provider: S3ClientProvider,
        bucket: string,
        key: string,
        readOutput: (output: GetObjectOutput) => Promise<T>,
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
