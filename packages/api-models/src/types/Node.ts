import type { Nomen } from "@phylopic/utils"
import type { Entity } from "./Entity"
import type { Link } from "./Link"
import type { Links } from "./Links"
import type { TitledLink } from "./TitledLink"
export interface NodeLinks extends Links<TitledLink> {
    readonly childNodes: readonly TitledLink[]
    readonly cladeImages: TitledLink
    readonly external: readonly TitledLink[]
    readonly images: Link
    readonly lineage: Link
    readonly parentNode: TitledLink | null
    readonly primaryImage: TitledLink | null
}
export interface Node extends Entity {
    readonly _links: NodeLinks
    readonly names: readonly Nomen[]
}
