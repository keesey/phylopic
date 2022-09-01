import { PutObjectTaggingCommand } from "@aws-sdk/client-s3"
import { Editable } from "../../interfaces/Editable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import writeTagging from "./io/writeTagging"
import S3TaggingDeletor from "./S3TaggingDeletor"
export default class S3TaggingEditor<T extends Readonly<Record<string, string | undefined>>>
    extends S3TaggingDeletor<T>
    implements Editable<T>
{
    constructor(provider: S3ClientProvider, bucket: string, key: string) {
        super(provider, bucket, key)
    }
    public async put(value: T): Promise<void> {
        await this.provider.getS3().send(
            new PutObjectTaggingCommand({
                Bucket: this.bucket,
                Key: this.key,
                Tagging: writeTagging(value),
            }),
        )
    }
}
