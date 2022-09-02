import { GetObjectTaggingCommand, ListObjectsV2Command, ListObjectsV2Output, Tagging } from "@aws-sdk/client-s3"
import { FaultDetector, isString } from "@phylopic/utils"
import { Listable } from "../../interfaces/Listable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
export default class S3TaggingLister<TValue extends Readonly<Record<string, string | null>>>
    implements Listable<TValue & { Key: string }, string>
{
    constructor(
        protected readonly provider: S3ClientProvider,
        protected readonly bucket: string,
        protected readonly prefix: string,
        protected readonly validate: FaultDetector<TValue>,
        protected readonly pageSize: number | undefined,
        protected readonly readTagging: (tagging: Tagging | undefined) => TValue,
    ) {}
    public async page(token?: string) {
        const output = await this.provider.getS3().send(this.getCommand(token))
        return {
            items: await this.getItems(output),
            next: output.NextContinuationToken,
        }
    }
    public async totalItems(): Promise<number> {
        let total = 0
        let token: string | undefined
        do {
            const output = await this.provider.getS3().send(this.getCommand(token))
            total += (await this.getItems(output)).length
            token = output.NextContinuationToken
        } while (token)
        return total
    }
    public async totalPages(): Promise<number> {
        let total = 0
        let token: string | undefined
        do {
            const output = await this.provider.getS3().send(this.getCommand(token))
            total++
            token = output.NextContinuationToken
        } while (token)
        return total
    }
    protected getCommand(token: string | undefined) {
        return new ListObjectsV2Command({
            Bucket: this.bucket,
            ContinuationToken: token,
            MaxKeys: this.pageSize,
            Prefix: this.prefix,
        })
    }
    protected async getItems(output: ListObjectsV2Output): Promise<ReadonlyArray<TValue & { Key: string }>> {
        const keys = output.Contents?.map(content => content.Key).filter(isString) ?? []
        const client = this.provider.getS3()
        const taggingOutputsSettled = await Promise.allSettled(
            keys.map(async Key =>
                client.send(
                    new GetObjectTaggingCommand({
                        Bucket: this.bucket,
                        Key,
                    }),
                ),
            ),
        )
        return taggingOutputsSettled
            .filter(isSettled)
            .map(settled => settled.value)
            .map((output, index) => ({ ...(this.readTagging(output) as TValue), Key: keys[index] }))
            .filter((value): value is TValue & { Key: string } => this.validate(value))
    }
}
const isSettled = <T>(x: PromiseSettledResult<T>): x is PromiseFulfilledResult<T> => x.status === "fulfilled"
