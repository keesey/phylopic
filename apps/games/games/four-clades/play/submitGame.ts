"use server"
import type { UUID } from "@phylopic/utils"
import { Game } from "../models"
import { adjudicate } from "./adjudicate"
export type SerializableSubmission = Readonly<{
    uuids: readonly UUID[]
    mistakes: number
}>
export const submitGame = async (game: Game, submission: SerializableSubmission) => {
    return await adjudicate(game, { ...submission, uuids: new Set(submission.uuids) })
}
