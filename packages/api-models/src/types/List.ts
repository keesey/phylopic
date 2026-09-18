import type { Data } from "./Data"
import type { Link } from "./Link"
import type { Links } from "./Links"
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
