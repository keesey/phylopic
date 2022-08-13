import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3"
import { S3ClientProvider } from "../interfaces/S3ClientProvider"
export class BaseClientProvider implements S3ClientProvider {
    protected s3: S3Client | null = null
    constructor(protected readonly s3Config: S3ClientConfig = {}) {}
    public async destroy() {
        this.s3?.destroy()
        this.s3 = null
    }
    public getS3(): S3Client {
        return this.s3 ?? (this.s3 = new S3Client(this.s3Config))
    }
}
