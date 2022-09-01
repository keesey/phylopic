import { GetObjectTaggingCommand } from "@aws-sdk/client-s3"
import { Readable } from "../../interfaces/Readable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import exists from "./methods/exists"
export default class S3TaggingReader<T extends Readonly<Record<string, string | undefined>>> implements Readable<T> {
    constructor(
        protected readonly provider: S3ClientProvider,
        protected readonly bucket: string,
        protected readonly key: string,
    ) {}
    public async get() {
        const output = await this.provider.getS3().send(
            new GetObjectTaggingCommand({
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
        return (output.TagSet?.reduce<Partial<T>>(
            (prev, item) => (item.Key ? { ...prev, [item.Key]: item.Value } : prev),
            {} as Partial<T>,
        ) ?? {}) as T
    }
    public async exists(): Promise<boolean> {
        return exists(this.provider.getS3(), this.bucket, this.key)
    }
}
