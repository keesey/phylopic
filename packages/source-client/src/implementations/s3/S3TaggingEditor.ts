import { PutObjectTaggingCommand, Tagging } from "@aws-sdk/client-s3"
import { Editable } from "../../interfaces/Editable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import writeTagging from "./io/writeTagging"
import S3TaggingDeletor from "./S3TaggingDeletor"
export default class S3TaggingEditor<T extends Readonly<Record<string, string | null>>>
    extends S3TaggingDeletor<T>
    implements Editable<T>
{
    constructor(
        provider: S3ClientProvider,
        bucket: string,
        key: string,
        readTagging: (tagging: Tagging | undefined) => T,
    ) {
        super(provider, bucket, key, readTagging)
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
