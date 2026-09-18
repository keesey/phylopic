import type { ISOTimestamp, URL } from "@phylopic/utils"
import type { Data } from "./Data"
import type { Link } from "./Link"
import type { Links } from "./Links"
import type { TitledLink } from "./TitledLink"
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
