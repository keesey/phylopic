import { ISOTimestamp, UUID } from "@phylopic/utils/dist/models/types"
import { Data } from "./Data"
import { Links } from "./Links"
export interface Entity<TLinks extends Links = Links> extends Data {
    readonly _links: TLinks
    readonly created: ISOTimestamp
    readonly uuid: UUID
}
