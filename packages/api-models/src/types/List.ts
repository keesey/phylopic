import { Data } from "./Data"
import { Link } from "./Link"
import { Links } from "./Links"
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
