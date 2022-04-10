import { Name } from "./Name"

export interface Taxon {
    readonly canonicalName: Name
    readonly names: readonly Name[]
}
