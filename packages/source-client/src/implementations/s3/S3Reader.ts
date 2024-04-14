import { GetObjectCommand, GetObjectOutput } from "@aws-sdk/client-s3"
import { Readable } from "../../interfaces/Readable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import { exists } from "./methods/exists"
export class S3Reader<T> implements Readable<T> {
    constructor(
        protected readonly provider: S3ClientProvider,
        protected readonly bucket: string,
        protected readonly key: string,
        protected readonly readOutput: (output: GetObjectOutput) => Promise<T>,
    ) {}
    public async get() {
        const output = await this.provider.getS3().send(
            new GetObjectCommand({
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
        return await this.readOutput(output)
    }
    public async exists(): Promise<boolean> {
        return exists(this.provider.getS3(), this.bucket, this.key)
    }
}
