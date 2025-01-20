import { Tagging } from "@aws-sdk/client-s3"
import { Deletable } from "../../interfaces/Deletable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import { copyFromTrash } from "./methods/copyFromTrash"
import { copyToTrash } from "./methods/copyToTrash"
import { deleteObject } from "./methods/deleteObject"
import { exists } from "./methods/exists"
import { S3TaggingReader } from "./S3TaggingReader"
export class S3TaggingDeletor<T extends Readonly<Record<string, string | null>>>
    extends S3TaggingReader<T>
    implements Deletable<T>
{
    constructor(
        provider: S3ClientProvider,
        bucket: string,
        key: string,
        readTagging: (tagging: Tagging | undefined) => T,
    ) {
        super(provider, bucket, key, readTagging)
    }
    public async delete() {
        if (await this.exists()) {
            await copyToTrash(this.provider.getS3(), this.bucket, this.key)
            await deleteObject(this.provider.getS3(), this.bucket, this.key)
        }
    }
    public async isRestorable(): Promise<boolean> {
        return exists(this.provider.getS3(), this.bucket, `trash/${this.key}`)
    }
    public async restore() {
        if (await this.isRestorable()) {
            await copyFromTrash(this.provider.getS3(), this.bucket, this.key)
            await deleteObject(this.provider.getS3(), this.bucket, `trash/${this.key}`)
            return this.get()
        }
        throw new Error("Cannot restore.")
    }
}
