import { ListObjectsV2Command, ListObjectsV2Output } from "@aws-sdk/client-s3"
import { FaultDetector } from "@phylopic/utils"
import { S3Entry } from "../../interfaces"
import { Listable } from "../../interfaces/Listable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
export default class S3Lister<TKey extends string = string> implements Listable<S3Entry<TKey>, string> {
    constructor(
        protected readonly provider: S3ClientProvider,
        protected readonly bucket: string,
        protected readonly prefix: string,
        protected readonly validateKey: FaultDetector<TKey>,
        protected readonly pageSize: number | undefined = undefined,
        protected readonly delimiter: string | null = "/",
    ) {}
    public async page(token?: string) {
        const output = await this.provider.getS3().send(this.getCommand(token))
        return {
            items: this.getItems(output),
            next: output.NextContinuationToken,
        }
    }
    public async totalItems(): Promise<number> {
        let total = 0
        let token: string | undefined
        do {
            const output = await this.provider.getS3().send(this.getCommand(token))
            total += this.getItems(output).length
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
            Delimiter: this.delimiter ?? undefined,
            ContinuationToken: token,
            MaxKeys: this.pageSize,
            Prefix: this.prefix,
        })
    }
    protected getItems(output: ListObjectsV2Output): readonly S3Entry<TKey>[] {
        if (!this.delimiter) {
            return (
                output.Contents?.map(
                    content =>
                        ({
                            Key: content.Key?.slice(this.prefix.length),
                            LastModified: content.LastModified,
                        }) as S3Entry<TKey>,
                ).filter<S3Entry<TKey>>((value): value is S3Entry<TKey> => this.validateKey(value.Key)) ?? []
            )
        }
        return (
            output.CommonPrefixes?.map(
                commonPrefix =>
                    ({
                        Key: decodeURIComponent(
                            commonPrefix.Prefix?.slice(this.prefix.length).replace(/\/$/, "") ?? "",
                        ),
                    }) as S3Entry<TKey>,
            ).filter<S3Entry<TKey>>((value): value is S3Entry<TKey> => this.validateKey(value.Key)) ?? []
        )
    }
}
