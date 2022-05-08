import { ISOTimestamp, UUID } from "@phylopic/utils"
import { Data } from "./Data.js"
import { Links } from "./Links.js"
export interface Entity<TLinks extends Links = Links> extends Data {
    readonly _links: TLinks
    readonly created: ISOTimestamp
    readonly uuid: UUID
}
