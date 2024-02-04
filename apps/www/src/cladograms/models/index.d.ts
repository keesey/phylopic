import { type UUID } from "@phylopic/utils"
export type Cladogram = Readonly<{
    graph: CladogramGraph
    metadata?: CladogramMetadata
    // :TODO: renderer options
}>
export type CladogramArc = Readonly<[number, number]> | Readonly<[number, number, CladogramArcMetadata]>
export type CladogramArcMetadata = Readonly<{
    label?: CladogramText
    weight?: number
}>
export type CladogramGraph = Readonly<{
    arcs: readonly CladogramArc[]
    nodes: ReadonlyArray<null | CladogramNode>
}>
export type CladogramMarkup = readonly CladogramMarkupNode[]
export type CladogramMarkupNode = Readonly<{
    class?: string
    text: string
}>
export type CladogramMetadata = Partial<
    Readonly<{
        author?: CladogramText
        title?: CladogramText
    }>
>
export type CladogramNode = Readonly<{
    identifier?: Readonly<[string, string, string]>
    imageUUID?: UUID
    label?: CladogramText
}>
export type CladogramText = string | CladogramMarkup
