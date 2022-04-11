import { Identifier, Nomen } from "phylopic-utils/src/models/types"
export type NodeIdentifier = Readonly<{
    identifier?: Identifier
    name: Nomen
}>
