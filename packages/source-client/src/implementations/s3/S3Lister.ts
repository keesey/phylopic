import { ListObjectsV2Command, ListObjectsV2Output, S3Client } from "@aws-sdk/client-s3"
import { FaultDetector } from "@phylopic/utils"
import { Listable } from "../../interfaces/Listable"
export default class S3Lister<TValue extends string = string> implements Listable<TValue, string> {
    constructor(
        protected getClient: () => S3Client,
        protected bucket: string,
        protected prefix: string,
        protected validate: FaultDetector<TValue>,
        protected pageSize: number | undefined = undefined,
    ) {}
    public async page(token?: string) {
        const output = await this.getClient().send(this.getCommand(token))
        return {
            items: this.getItems(output),
            next: output.NextContinuationToken,
        }
    }
    public async totalItems(): Promise<number> {
        let total = 0
        let token: string | undefined
        do {
            const output = await this.getClient().send(this.getCommand(token))
            total += this.getItems(output).length
            token = output.NextContinuationToken
        } while (token)
        return total
    }
    public async totalPages(): Promise<number> {
        let total = 0
        let token: string | undefined
        do {
            const output = await this.getClient().send(this.getCommand(token))
            total++
            token = output.NextContinuationToken
        } while (token)
        return total
    }
    protected getCommand(token: string | undefined) {
        return new ListObjectsV2Command({
            Bucket: this.bucket,
            Delimiter: "/",
            ContinuationToken: token,
            MaxKeys: this.pageSize,
            Prefix: this.prefix,
        })
    }
    protected getItems(output: ListObjectsV2Output): readonly TValue[] {
        return (
            output.CommonPrefixes?.map(commonPrefix =>
                decodeURIComponent(commonPrefix.Prefix?.slice(this.prefix.length).replace(/\/$/, "") ?? ""),
            ).filter<TValue>((value): value is TValue => this.validate(value)) ?? []
        )
    }
}
