import { ListObjectsV2Command, ListObjectsV2Output } from "@aws-sdk/client-s3"
import { FaultDetector } from "@phylopic/utils"
import { Listable } from "../../interfaces/Listable"
import { S3ClientProvider } from "../../interfaces/S3ClientProvider"
export default class S3Lister<TValue extends string = string> implements Listable<TValue, string> {
    constructor(
        protected readonly provider: S3ClientProvider,
        protected readonly bucket: string,
        protected readonly prefix: string,
        protected readonly validate: FaultDetector<TValue>,
        protected readonly pageSize: number | undefined = undefined,
        protected readonly delimiter: string | null = "/",
    ) {}
    public async page(token?: string) {
        const output = await this.provider.getS3().send(this.getCommand(token))
        console.debug(output)
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
    protected getItems(output: ListObjectsV2Output): readonly TValue[] {
        if (!this.delimiter) {
            return (
                output.Contents?.map(content => content.Key?.slice(this.prefix.length)).filter<TValue>(
                    (value): value is TValue => this.validate(value),
                ) ?? []
            )
        }
        return (
            output.CommonPrefixes?.map(commonPrefix =>
                decodeURIComponent(commonPrefix.Prefix?.slice(this.prefix.length).replace(/\/$/, "") ?? ""),
            ).filter<TValue>((value): value is TValue => this.validate(value)) ?? []
        )
    }
}
