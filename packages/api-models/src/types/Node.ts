import { Nomen } from "@phylopic/utils"
import { Entity } from "./Entity.js"
import { Link } from "./Link.js"
import { Links } from "./Links.js"
import { TitledLink } from "./TitledLink.js"
export interface NodeLinks extends Links {
    readonly childNodes: readonly Link[]
    readonly cladeImages: Link | null
    readonly external: readonly TitledLink[]
    readonly images: Link | null
    readonly lineage: Link
    readonly parentNode: Link | null
    readonly primaryImage: Link | null
}
export interface Node extends Entity {
    readonly _links: NodeLinks
    readonly names: readonly Nomen[]
}
