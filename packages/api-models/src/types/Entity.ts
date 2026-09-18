import type { ISOTimestamp, UUID } from "@phylopic/utils"
import type { Data } from "./Data"
import type { Links } from "./Links"

export interface Entity<TLinks extends Links = Links> extends Data {
    readonly _links: TLinks
    readonly created: ISOTimestamp
    readonly uuid: UUID
}
