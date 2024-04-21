import { isUUIDv4 } from "@phylopic/utils"
import { trimNode } from "../generate/trimNode"
import { Submission } from "./BoardContainer"
import { LossAction, WinAction } from "./actions"
import { Answer, Game } from "../models"
const getDiscrepancy = (answer: Answer, submission: Submission): number => {
    return answer.images.reduce<number>((sum, image) => (submission.has(image.uuid) ? sum + 1 : sum), 0)
}
const getMinDiscrepancy = (answers: Game["answers"], submission: Submission): number => {
    return answers.reduce<number>(
        (prev, answer) => Math.min(prev, getDiscrepancy(answer, submission)),
        Number.MAX_SAFE_INTEGER,
    )
}
export const adjudicate = (game: Game, submission: Submission): LossAction | WinAction => {
    if (!game?.answers?.length) {
        throw new Error("Invalid game.")
    }
    const uuids = Array.from(submission)
    if (submission.size !== game.answers[0].images.length || uuids.some(uuid => !isUUIDv4(uuid))) {
        throw new Error("Invalid submission.")
    }
    const answer = game.answers.find(answer => uuids.every(uuid => answer.images.some(image => image.uuid === uuid)))
    if (answer) {
        return {
            payload: trimNode(answer.node),
            type: "WIN",
        }
    }
    return {
        payload: getMinDiscrepancy(game.answers, submission),
        type: "LOSS",
    }
}
