import type { Image, ImageWithEmbedded, Node, NodeWithEmbedded } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
// :TODO: Sponsor?
export type GameImage = Pick<Image, "attribution" | "modifiedFile" | "uuid"> & {
    _embedded: Pick<ImageWithEmbedded["_embedded"], "specificNode">
    _links: Pick<Image["_links"], "license" | "rasterFiles" | "self" | "thumbnailFiles" | "vectorFile">
}
export type GameNode = Pick<Node, "names" | "uuid"> & {
    _embedded: Pick<NodeWithEmbedded["_embedded"], "primaryImage">
    _links: Pick<Node["_links"], "lineage" | "self">
}
export type BoardImageState = Readonly<{
    image: GameImage
    mode: null | "selected" | "submitted" | "completed"
}>
export type BoardState = Readonly<{
    answers: readonly GameNode[]
    discrepancy: number | null
    imageUUIDs: readonly UUID[]
    images: Readonly<Record<UUID, BoardImageState>>
    lastSubmission: readonly UUID[]
    mistakes: number
    totalAnswers: number
}>
