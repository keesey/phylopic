import { UUID } from "@phylopic/utils"
import { Entity } from "./Entity.js"
import { Link } from "./Link.js"
import { Links } from "./Links.js"
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
