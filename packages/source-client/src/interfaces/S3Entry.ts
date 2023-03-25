import { ISOTimestamp } from "@phylopic/utils"

export type S3Entry<TKey extends string = string> = { Key: TKey; LastModified?: ISOTimestamp }
