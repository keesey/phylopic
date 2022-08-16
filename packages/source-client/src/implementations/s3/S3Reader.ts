import { GetObjectCommand, GetObjectOutput, HeadObjectCommand } from "@aws-sdk/client-s3"
import { isAWSError } from "@phylopic/utils-aws"
import { Readable } from "../../interfaces/Readable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
export default class S3Reader<T> implements Readable<T> {
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
        try {
            const output = await this.provider.getS3().send(
                new HeadObjectCommand({
                    Bucket: this.bucket,
                    Key: this.key,
                }),
            )
            return typeof output.$metadata.httpStatusCode === "number" && output.$metadata.httpStatusCode === 200
        } catch (e) {
            if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
                return false
            }
            throw e
        }
    }
}
