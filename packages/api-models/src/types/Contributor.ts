import { Entity } from "./Entity"
import { Link } from "./Link"
import { Links } from "./Links"
import { TitledLink } from "./TitledLink"
export interface ContributorLinks extends Links<TitledLink> {
    readonly contact: Link | null
    readonly images: Link
    // :TODO: latestImage (embeddables)
}
export interface Contributor extends Entity<ContributorLinks> {
    readonly count: number
    readonly name: string
}
