import { Image, Node, NodeWithEmbedded } from "@phylopic/api-models"
// :TODO: Sponsor?
export type CladesGameImage = Pick<Image, "attribution" | "modifiedFile" | "uuid"> & {
    _links: Pick<Image["_links"], "license" | "rasterFiles" | "self" | "thumbnailFiles" | "vectorFile">
}
export type CladesGameNode = Pick<Node, "names" | "uuid"> & {
    _embedded: Pick<NodeWithEmbedded["_embedded"], "primaryImage">
    _links: Pick<Node["_links"], "lineage" | "self">
}
export type CladesGameAnswer = Readonly<{
    images: readonly CladesGameImage[]
    node: CladesGameNode
}>
export type CladesGame = Readonly<{
    answers: readonly CladesGameAnswer[]
}>
