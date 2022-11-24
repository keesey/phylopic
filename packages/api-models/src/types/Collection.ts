import { UUID } from "@phylopic/utils"
import { Data } from "./Data"
import { Link } from "./Link"
import { Links } from "./Links"
export interface CollectionLinks extends Links {
    readonly contributors: Link
    readonly images: Link
    readonly nodes: Link
}
export interface Collection {
    readonly _links: CollectionLinks
    readonly uuid: UUID
}
