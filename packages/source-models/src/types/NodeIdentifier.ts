import type { Identifier, Nomen } from "@phylopic/utils"
export type NodeIdentifier = Readonly<{
    identifier: Identifier | null
    name: Nomen
}>
