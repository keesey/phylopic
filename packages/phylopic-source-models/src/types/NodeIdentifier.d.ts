import { Identifier, Nomen } from "phylopic-utils/src"
export type NodeIdentifier = Readonly<{
    identifier: Identifier | null
    name: Nomen
}>
