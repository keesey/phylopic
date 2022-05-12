import { Nomen, UUID } from "@phylopic/utils"

export type Vertex = Readonly<{
    changed: boolean
    column: number
    name: Nomen
    row: number
    uuid: UUID
}>
