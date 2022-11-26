import { Contributor, ImageWithEmbedded, NodeWithEmbedded } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import { CollectionPermalinkData } from "~/permalinks/types/CollectionPermalinkData"
export type EntityRecord =
    | Readonly<{
          entity: Contributor
          type: "contributor"
      }>
    | Readonly<{
          entity: ImageWithEmbedded
          type: "image"
      }>
    | Readonly<{
          entity: NodeWithEmbedded
          type: "node"
      }>
export type State = Readonly<{
    collections: Readonly<Record<string, ReadonlySet<UUID>>>
    currentCollection: string | null
    entities: Readonly<Record<UUID, EntityRecord>>
}>
