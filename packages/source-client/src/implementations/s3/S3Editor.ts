import { GetObjectOutput, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3"
import { Editable } from "../../interfaces/Editable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import { S3Deletor } from "./S3Deletor"
export class S3Editor<T> extends S3Deletor<T> implements Editable<T> {
    constructor(
        provider: S3ClientProvider,
        bucket: string,
        key: string,
        readOutput: (output: GetObjectOutput) => Promise<T>,
        protected readonly writeOutput: (value: T) => Promise<Partial<PutObjectCommandInput>>,
    ) {
        super(provider, bucket, key, readOutput)
    }
    public async put(value: T): Promise<void> {
        if (await this.exists()) {
            await this.copyToTrash()
        }
        await this.provider.getS3().send(
            new PutObjectCommand({
                ...(await this.writeOutput(value)),
                Bucket: this.bucket,
                Key: this.key,
            }),
        )
    }
}
