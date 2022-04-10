import { LicenseURL, RasterMediaType, VectorMediaType } from ".."
import { Entity } from "./Entity"
import { Link } from "./Link"
import { Links } from "./Links"
import { MediaLink } from "./MediaLink"
import { URL } from "./URL"
export interface ImageLinks extends Links {
    readonly contributor: Link
    readonly generalNode: Link | null
    readonly "http://ogp.me/ns#image": MediaLink<URL, RasterMediaType>
    readonly license: Link<LicenseURL>
    readonly nodes: readonly Link[]
    readonly rasterFiles: readonly MediaLink<URL, RasterMediaType>[]
    readonly sourceFile: MediaLink<URL>
    readonly specificNode: Link
    readonly thumbnailFiles: readonly MediaLink<URL, RasterMediaType>[]
    readonly "twitter:image": MediaLink<URL, RasterMediaType>
    readonly vectorFile: MediaLink<URL, VectorMediaType>
}
export interface Image extends Entity<ImageLinks> {
    readonly attribution: string | null
    readonly sponsor: string | null
}
