import { isUUIDv4 } from "@phylopic/utils"
import { trimNode } from "./trimNode"
import { Submission } from "./BoardContainer"
import { LossAction, WinAction } from "./actions"
import { Answer, Game } from "../models"
import { getBuild, getNodeByLink } from "~/lib/api"
const getDiscrepancy = (answer: Answer, submission: Submission): number => {
    return answer.imageUUIDs.reduce<number>((sum, imageUUID) => (submission.has(imageUUID) ? sum + 1 : sum), 0)
}
const getMinDiscrepancy = (answers: Game["answers"], submission: Submission): number => {
    return answers.reduce<number>(
        (prev, answer) => Math.min(prev, getDiscrepancy(answer, submission)),
        Number.MAX_SAFE_INTEGER,
    )
}
export const adjudicate = async (game: Game, submission: Submission): Promise<LossAction | WinAction> => {
    if (!game?.answers?.length) {
        throw new Error("Invalid game.")
    }
    const uuids = Array.from(submission)
    if (submission.size !== game.answers[0].imageUUIDs.length || uuids.some(uuid => !isUUIDv4(uuid))) {
        throw new Error("Invalid submission.")
    }
    const answer = game.answers.find(answer =>
        uuids.every(uuid => answer.imageUUIDs.some(imageUUID => imageUUID === uuid)),
    )
    if (answer) {
        const build = await getBuild()
        const node = await getNodeByLink(
            { href: `/nodes/${encodeURIComponent(answer.nodeUUID)}` },
            { build, embed_primaryImage: "true" },
        )
        if (!node) {
            throw new Error("Could not find node: " + answer.nodeUUID)
        }
        return {
            payload: trimNode(node),
            type: "WIN",
        }
    }
    return {
        payload: getMinDiscrepancy(game.answers, submission),
        type: "LOSS",
    }
}
