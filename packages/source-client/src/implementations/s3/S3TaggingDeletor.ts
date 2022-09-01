import { Deletable } from "../../interfaces/Deletable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import copyToTrash from "./methods/copyToTrash"
import deleteObject from "./methods/deleteObject"
import S3TaggingReader from "./S3TaggingReader"
export default class S3TaggingDeletor<T extends Readonly<Record<string, string | undefined>>>
    extends S3TaggingReader<T>
    implements Deletable<T>
{
    constructor(provider: S3ClientProvider, bucket: string, key: string) {
        super(provider, bucket, key)
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
