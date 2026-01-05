import { GetObjectOutput } from "@aws-sdk/client-s3"
import { Deletable } from "../../interfaces/Deletable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import { copyFromTrash } from "./methods/copyFromTrash"
import { copyToTrash } from "./methods/copyToTrash"
import { deleteObject } from "./methods/deleteObject"
import { exists } from "./methods/exists"
import { S3Reader } from "./S3Reader"
export class S3Deletor<T> extends S3Reader<T> implements Deletable<T> {
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
            await deleteObject(this.provider.getS3(), this.bucket, this.key)
        }
    }
    public async isRestorable(): Promise<boolean> {
        return exists(this.provider.getS3(), this.bucket, `trash/${this.key}`)
    }
    public async restore() {
        if (await this.isRestorable()) {
            await this.copyFromTrash()
            await deleteObject(this.provider.getS3(), this.bucket, `trash/${this.key}`)
            return this.get()
        }
        throw new Error("Cannot restore")
    }
    protected async copyFromTrash() {
        await copyFromTrash(this.provider.getS3(), this.bucket, this.key)
    }
    protected async copyToTrash() {
        await copyToTrash(this.provider.getS3(), this.bucket, this.key)
    }
}
