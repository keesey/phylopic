import { UUID } from "phylopic-utils/src/models/types"
import { Entity } from "./Entity"
import { Link } from "./Link"
import { Links } from "./Links"
export interface ContributorLinks extends Links {
    readonly contact: Link | null
    readonly images: Link
    // :TODO: latestImage (embeddables)
}
export interface Contributor extends Entity<ContributorLinks> {
    readonly count: number
    readonly name: string
    readonly uuid: UUID
}
