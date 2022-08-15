import { Nomen, UUID } from "@phylopic/utils"

export type NodePost = {
    readonly name: Nomen
    readonly parent: UUID
}
