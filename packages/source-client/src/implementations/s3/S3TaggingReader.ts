import { GetObjectTaggingCommand, Tagging } from "@aws-sdk/client-s3"
import { Readable } from "../../interfaces/Readable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import createTaggingReader from "./io/createTaggingReader"
import exists from "./methods/exists"
export default class S3TaggingReader<T extends Readonly<Record<string, string | null>>> implements Readable<T> {
    constructor(
        protected readonly provider: S3ClientProvider,
        protected readonly bucket: string,
        protected readonly key: string,
        protected readonly readTagging: (tagging: Tagging | undefined) => T,
    ) {}
    public async get() {
        const output = await this.provider.getS3().send(
            new GetObjectTaggingCommand({
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
        return this.readTagging(output)
    }
    public async exists(): Promise<boolean> {
        return exists(this.provider.getS3(), this.bucket, this.key)
    }
}
