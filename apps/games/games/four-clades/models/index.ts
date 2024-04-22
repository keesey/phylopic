import { UUID } from "@phylopic/utils"
export type Answer = Readonly<{
    imageUUIDs: readonly UUID[]
    nodeUUID: UUID
}>
export type Game = Readonly<{
    answers: readonly Answer[]
}>
