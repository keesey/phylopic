import { UUID } from "@phylopic/utils"
import { GameImage, GameNode } from "../models"
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
