import { ISOTimestamp, URL } from "phylopic-utils"
import { Data } from "./Data"
import { Link } from "./Link"
import { Links } from "./Links"
import { TitledLink } from "./TitledLink"
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
