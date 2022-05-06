import { Links } from "./Links"
export interface QueryMatches {
    readonly _links: Links
    readonly build: number
    readonly matches: readonly string[]
}
