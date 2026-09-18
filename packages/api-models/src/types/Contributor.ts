import type { Entity } from "./Entity"
import type { Link } from "./Link"
import type { Links } from "./Links"
import type { TitledLink } from "./TitledLink"

export interface ContributorLinks extends Links<TitledLink> {
    readonly contact: Link | null
    readonly images: Link
    // :TODO: latestImage (embeddables)
}

export interface Contributor extends Entity<ContributorLinks> {
    readonly count: number
    readonly name: string
}
