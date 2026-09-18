import type { UUIDish } from "@phylopic/utils"
import type { Link } from "./Link"
import type { Links } from "./Links"

export interface CollectionLinks extends Links {
    readonly contributors: Link
    readonly images: Link
    readonly nodes: Link
}

export interface Collection {
    readonly _links: CollectionLinks
    readonly uuid: UUIDish
}
