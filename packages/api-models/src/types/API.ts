import { ISOTimestamp, URL } from "@phylopic/utils"
import { Data } from "./Data.js"
import { Link } from "./Link.js"
import { Links } from "./Links.js"
import { TitledLink } from "./TitledLink.js"
export interface APILinks extends Links {
    readonly contact: TitledLink<URL>
    readonly documentation: Link<URL>
    readonly resources: readonly TitledLink[]
}
export interface API extends Data {
    readonly _links: APILinks
    readonly buildTimestamp: ISOTimestamp
    readonly title: string
    readonly version: string
}
