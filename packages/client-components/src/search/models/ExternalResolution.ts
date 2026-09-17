import { NodeWithEmbedded } from "@phylopic/api-models"

export interface ExternalResolution {
    readonly authority: string
    readonly namespace: string
    readonly node: NodeWithEmbedded
    readonly objectID: string
    readonly title: string
    readonly uuid: string
}
