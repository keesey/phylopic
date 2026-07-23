import { Tagging } from "@aws-sdk/client-s3"
import { Patchable } from "../../interfaces"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import { S3TaggingEditor } from "./S3TaggingEditor"
export class S3TaggingPatcher<T extends Readonly<Record<string, string | null>>>
    extends S3TaggingEditor<T>
    implements Patchable<T>
{
    constructor(
        provider: S3ClientProvider,
        bucket: string,
        key: string,
        readTagging: (tagging: Tagging | undefined) => T,
    ) {
        super(provider, bucket, key, readTagging)
    }
    public async patch(value: T): Promise<void> {
        const previous = await this.get()
        await this.put({
            ...previous,
            ...value,
        })
    }
}
