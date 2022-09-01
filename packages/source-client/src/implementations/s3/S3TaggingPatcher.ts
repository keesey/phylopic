import { Patchable } from "../../interfaces"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
import S3TaggingEditor from "./S3TaggingEditor"
export default class S3TaggingPatcher<T extends Readonly<Record<string, string | undefined>>>
    extends S3TaggingEditor<T>
    implements Patchable<T>
{
    constructor(provider: S3ClientProvider, bucket: string, key: string) {
        super(provider, bucket, key)
    }
    public async patch(value: T): Promise<void> {
        const previous = await this.get()
        await this.put({
            ...previous,
            ...value,
        })
    }
}
