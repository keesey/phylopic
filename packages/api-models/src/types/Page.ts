import { Data } from "./Data"
import { Link } from "./Link"
import { Links } from "./Links"
import { TitledLink } from "./TitledLink"
export interface PageLinks extends Links {
    readonly items: readonly TitledLink[]
    readonly list: Link
    readonly next: Link | null
    readonly previous: Link | null
}
export interface Page extends Data {
    readonly _links: PageLinks
    readonly index: number
}
