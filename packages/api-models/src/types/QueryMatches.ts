import { Links } from "./Links.js"
export interface QueryMatches {
    readonly _links: Links
    readonly build: number
    readonly matches: readonly string[]
}
