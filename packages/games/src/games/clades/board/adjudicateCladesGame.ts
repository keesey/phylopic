import { isUUIDv4 } from "@phylopic/utils"
import { CladesGame, CladesGameAnswer } from "../generate"
import { trimNode } from "../generate/trimNode"
import { CladesGameSubmission } from "./CladesBoardContainer"
import { CladesGameLossAction, CladesGameWinAction } from "./actions"
const getDiscrepancy = (answer: CladesGameAnswer, submission: CladesGameSubmission): number => {
    return answer.images.reduce<number>((sum, image) => (submission.has(image.uuid) ? sum + 1 : sum), 0)
}
const getMinDiscrepancy = (answers: CladesGame["answers"], submission: CladesGameSubmission): number => {
    return answers.reduce<number>(
        (prev, answer) => Math.min(prev, getDiscrepancy(answer, submission)),
        Number.MAX_SAFE_INTEGER,
    )
}
export const adjudicateCladesGame = (
    game: CladesGame,
    submission: CladesGameSubmission,
): CladesGameLossAction | CladesGameWinAction => {
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
