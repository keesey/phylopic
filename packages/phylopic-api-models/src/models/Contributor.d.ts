import { EmailAddress } from "."
import { Entity } from "./Entity"
import { Link } from "./Link"
import { Links } from "./Links"
export interface ContributorLinks extends Links {
    readonly images: Link
    // :TODO: latestImage (embeddables)
}
export interface Contributor extends Entity<ContributorLinks> {
    readonly count: number
    readonly email: EmailAddress
}
