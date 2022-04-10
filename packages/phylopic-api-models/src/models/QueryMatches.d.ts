import { Links } from "./Links"
export interface QueryMatches {
    readonly _links: Links
    readonly matches: readonly string[]
}
