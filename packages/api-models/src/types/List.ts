import { Data } from "./Data.js"
import { Link } from "./Link.js"
import { Links } from "./Links.js"
export interface ListLinks extends Links {
    readonly firstPage: Link | null
    readonly lastPage: Link | null
}
export interface List extends Data {
    readonly _links: ListLinks
    readonly itemsPerPage: number
    readonly totalItems: number
    readonly totalPages: number
}
