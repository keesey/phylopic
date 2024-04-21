import type { Image, Node, NodeWithEmbedded } from "@phylopic/api-models"
// :TODO: Sponsor?
export type GameImage = Pick<Image, "attribution" | "modifiedFile" | "uuid"> & {
    _links: Pick<Image["_links"], "license" | "rasterFiles" | "self" | "thumbnailFiles" | "vectorFile">
}
export type GameNode = Pick<Node, "names" | "uuid"> & {
    _embedded: Pick<NodeWithEmbedded["_embedded"], "primaryImage">
    _links: Pick<Node["_links"], "lineage" | "self">
}
export type Answer = Readonly<{
    images: readonly GameImage[]
    node: GameNode
}>
export type Game = Readonly<{
    answers: readonly Answer[]
}>
