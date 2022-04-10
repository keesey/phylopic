import { NomenPart } from "parse-nomen"
import { Identifier } from "./Identifier"

export type NodeIdentifier = Readonly<{
    identifier?: Identifier
    name: readonly NomenPart[]
}>
