import type { ISOTimestamp, LicenseURL, RasterMediaType, URL, VectorMediaType } from "@phylopic/utils"
import { Entity } from "./Entity"
import { Link } from "./Link"
import { Links } from "./Links"
import { MediaLink } from "./MediaLink"
import { TitledLink } from "./TitledLink"
export interface ImageLinks extends Links<TitledLink> {
    readonly contributor: TitledLink
    readonly generalNode: TitledLink | null
    readonly "http://ogp.me/ns#image": MediaLink<URL, RasterMediaType>
    readonly license: Link<LicenseURL>
    readonly nodes: readonly TitledLink[]
    readonly rasterFiles: readonly MediaLink<URL, RasterMediaType>[]
    readonly sourceFile: MediaLink<URL>
    readonly specificNode: TitledLink
    readonly thumbnailFiles: readonly MediaLink<URL, RasterMediaType>[]
    // :TODO: Remove this line
    readonly "twitter:image"?: MediaLink<URL, RasterMediaType>
    readonly vectorFile: MediaLink<URL, VectorMediaType>
}
export interface Image extends Entity<ImageLinks> {
    readonly attribution: string | null
    readonly modified: ISOTimestamp
    readonly modifiedFile: ISOTimestamp
    readonly sponsor: string | null
    readonly unlisted?: true
}
