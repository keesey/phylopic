import { Contributor, Image, Node } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
export type EntityRecord =
    | Readonly<{
          entity: Contributor
          type: "contributor"
      }>
    | Readonly<{
          entity: Image
          type: "image"
      }>
    | Readonly<{
          entity: Node
          type: "node"
      }>
export type State = Readonly<{
    collections: Readonly<Record<string, ReadonlySet<UUID>>>
    currentCollection: string
    entities: Readonly<Record<UUID, EntityRecord>>
    open: boolean
}>
