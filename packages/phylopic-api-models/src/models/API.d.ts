import { Data } from "./Data"
import { ISOTimestamp } from "./ISOTimestamp"
import { Link } from "./Link"
import { Links } from "./Links"
import { TitledLink } from "./TitledLink"
import { URL } from "./URL"
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
