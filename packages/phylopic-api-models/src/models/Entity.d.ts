import { Data } from "./Data"
import { ISOTimestamp } from "./ISOTimestamp"
import { Links } from "./Links"
import { UUID } from "./UUID"
export interface Entity<TLinks extends Links = Links> extends Data {
    readonly _links: TLinks
    readonly created: ISOTimestamp
    readonly uuid: UUID
}
