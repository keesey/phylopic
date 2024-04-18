import { UUID } from "@phylopic/utils"
import { CladesGameImage, CladesGameNode } from "../generate"
export type CladesBoardImageState = Readonly<{
    image: CladesGameImage
    mode: null | "selected" | "submitted" | "completed"
}>
export type CladesBoardAnswer = Readonly<{
    imageUUIDs: readonly UUID[]
    node: CladesGameNode
}>
export type CladesBoardState = Readonly<{
    answers: readonly CladesBoardAnswer[]
    discrepancy: number | null
    imageUUIDs: readonly UUID[]
    images: Readonly<Record<UUID, CladesBoardImageState>>
    mistakes: number
}>
