import type { LicenseURL, RasterMediaType, URL, VectorMediaType } from "@phylopic/utils"
import { Entity } from "./Entity.js"
import { Link } from "./Link.js"
import { Links } from "./Links.js"
import { MediaLink } from "./MediaLink.js"
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
