import { UUIDish } from "@phylopic/utils"
import { Link } from "./Link"
import { Links } from "./Links"
export interface CollectionLinks extends Links {
    readonly contributors: Link
    readonly images: Link
    readonly nodes: Link
}
export interface Collection {
    readonly _links: CollectionLinks
    readonly uuid: UUIDish
}
