import { Tagging } from "@aws-sdk/client-s3"
import { Deletable } from "../../interfaces/Deletable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import copyToTrash from "./methods/copyToTrash"
import deleteObject from "./methods/deleteObject"
import S3TaggingReader from "./S3TaggingReader"
export default class S3TaggingDeletor<T extends Readonly<Record<string, string | null>>>
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
            await this.copyToTrash()
            await deleteObject(this.provider.getS3(), this.bucket, this.key)
        }
    }
    protected async copyToTrash() {
        await copyToTrash(this.provider.getS3(), this.bucket, this.key)
    }
}
