import { Contributor, ImageWithEmbedded, NodeWithEmbedded } from "@phylopic/api-models"
import { UUIDish } from "@phylopic/utils"
export type CollectionPermalinkData = Readonly<{
    entities: Readonly<{
        contributors: readonly Contributor[]
        nodes: readonly NodeWithEmbedded[]
        images: readonly ImageWithEmbedded[]
    }>
    type: "collection"
    uuid: UUIDish
}>
