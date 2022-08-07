import { GetObjectCommand, GetObjectOutput, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { isAWSError } from "@phylopic/utils-aws"
import { Readable } from "../interfaces"
export default class Reader<T> implements Readable<T> {
    constructor(
        protected getClient: () => S3Client,
        protected bucket: string,
        protected key: string,
        protected readOutput: (output: GetObjectOutput) => Promise<T>,
    ) {}
    public async get() {
        const output = await this.getClient().send(
            new GetObjectCommand({
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
        return await this.readOutput(output)
    }
    public async exists(): Promise<boolean> {
        try {
            const output = await this.getClient().send(
                new HeadObjectCommand({
                    Bucket: this.bucket,
                    Key: this.key,
                }),
            )
            return (
                typeof output.$metadata.httpStatusCode === "number" &&
                output.$metadata.httpStatusCode >= 200 &&
                output.$metadata.httpStatusCode < 300
            )
        } catch (e) {
            if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
                return false
            }
            throw e
        }
    }
}
