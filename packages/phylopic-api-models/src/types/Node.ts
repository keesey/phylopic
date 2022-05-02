import { Nomen } from "phylopic-utils/src/models/types/Nomen"
import { Entity } from "./Entity"
import { Link } from "./Link"
import { Links } from "./Links"
import { TitledLink } from "./TitledLink"
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
