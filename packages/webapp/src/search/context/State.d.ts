import { ImageWithEmbedded, NodeWithEmbedded } from "@phylopic/api-models"
import { Authority, Namespace, ObjectID, UUID } from "@phylopic/utils"
export type State = Readonly<{
    focused: boolean
    externalMatches: readonly string[]
    externalResults: Readonly<Record<Authority, Readonly<Record<Namespace, Readonly<Record<ObjectID, string>>>>>>
    imageResults: readonly ImageWithEmbedded[]
    internalMatches: readonly string[]
    nodeResults: readonly NodeWithEmbedded[]
    resolutions: Readonly<Record<Authority, Readonly<Record<Namespace, Readonly<Record<ObjectID, UUID>>>>>>
    resolvedNodes: Readonly<Record<UUID, NodeWithEmbedded>>
    text: string
}>
