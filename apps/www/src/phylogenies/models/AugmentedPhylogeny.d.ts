import { Nomen, type Identifier, type UUID } from "@phylopic/utils"
export type Arc = Readonly<[number, number]> | Readonly<[number, number, number]>
export type AugmentedPhylogeny = Readonly<{
    arcs: readonly Arc[]
    identifiers: readonly Identifier[][]
    imageUUIDs: ReadonlyArray<UUID | null>
    labelMap: readonly Nomen[]
    vertexOrder: readonly number[]
}>
