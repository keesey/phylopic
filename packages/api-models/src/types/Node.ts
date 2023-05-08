import { Nomen } from "@phylopic/utils"
import { Entity } from "./Entity"
import { Link } from "./Link"
import { Links } from "./Links"
import { TitledLink } from "./TitledLink"
import { ValueLink } from "./ValueLink"
export interface NodeLinks extends Links<TitledLink> {
    readonly childNodes: readonly TitledLink[]
    readonly cladeImages: TitledLink | null
    readonly external: readonly TitledLink[]
    readonly images: Link | null
    readonly lineage: Link
    readonly parentNode: TitledLink | null
    readonly primaryImage: TitledLink | null
    readonly ["timetree.org/age"]: ValueLink | null
}
export interface Node extends Entity {
    readonly _links: NodeLinks
    readonly names: readonly Nomen[]
}
