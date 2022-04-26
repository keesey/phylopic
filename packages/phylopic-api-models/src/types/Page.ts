import { Data } from "./Data"
import { Link } from "./Link"
import { Links } from "./Links"
export interface PageLinks extends Links {
    readonly items: readonly Link[]
    readonly list: Link
    readonly next: Link | null
    readonly previous: Link | null
}
export interface Page extends Data {
    readonly _links: PageLinks
    readonly index: number
}
