import { Data } from "./Data.js"
import { Link } from "./Link.js"
import { Links } from "./Links.js"
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
