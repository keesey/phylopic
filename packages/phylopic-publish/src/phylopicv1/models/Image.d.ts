import { Account } from "./Account"
import { PNGFile } from "./PNGFile"
import { SVGFile } from "./SVGFile"

export declare interface Image {
    readonly credit: string
    readonly directNames: ReadonlyArray<{
        readonly uid: string
    }>
    readonly licenseURL: string
    readonly modified: string
    readonly pngFiles: ReadonlyArray<PNGFile>
    readonly submitted: string
    readonly submitter: Account
    readonly svgFile: SVGFile | null
    readonly uid: string
}
