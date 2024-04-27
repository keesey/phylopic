import { UUID, isDefined, isUUIDv4 } from "@phylopic/utils"
import { getBuild, getNodeByLink } from "~/lib/api"
import { Answer, Game } from "../models"
import { Submission } from "./BoardContainer"
import { LoseAction, LossAction, WinAction } from "./actions"
import { trimNode } from "./trimNode"
import { MAX_MISTAKES } from "./MAX_MISTAKES"
const getDiscrepancy = (answer: Answer, submission: Submission): number => {
    return answer.imageUUIDs.reduce<number>((sum, imageUUID) => (submission.uuids.has(imageUUID) ? sum + 1 : sum), 0)
}
const getMinDiscrepancy = (answers: Game["answers"], submission: Submission): number => {
    return answers.reduce<number>(
        (prev, answer) => Math.min(prev, getDiscrepancy(answer, submission)),
        Number.MAX_SAFE_INTEGER,
    )
}
const getNodeByUUID = async (build: number, uuid: UUID) => {
    return getNodeByLink({ href: `/nodes/${encodeURIComponent(uuid)}` }, { build, embed_primaryImage: "true" })
}
export const adjudicate = async (game: Game, submission: Submission): Promise<LoseAction | LossAction | WinAction> => {
    if (!game?.answers?.length) {
        throw new Error("Invalid game.")
    }
    const uuids = Array.from(submission.uuids)
    if (submission.uuids.size !== game.answers[0].imageUUIDs.length || uuids.some(uuid => !isUUIDv4(uuid))) {
        throw new Error("Invalid submission.")
    }
    const answer = game.answers.find(answer =>
        uuids.every(uuid => answer.imageUUIDs.some(imageUUID => imageUUID === uuid)),
    )
    if (answer) {
        const build = await getBuild()
        const node = await getNodeByUUID(build, answer.nodeUUID)
        if (!node) {
            throw new Error("Could not find node: " + answer.nodeUUID)
        }
        return {
            payload: trimNode(node),
            type: "WIN",
        }
    }
    if (submission.mistakes + 1 >= MAX_MISTAKES) {
        const build = await getBuild()
        return {
            payload: (await Promise.all(game.answers.map(answer => getNodeByUUID(build, answer.nodeUUID)))).filter(
                isDefined,
            ),
            type: "LOSE",
        }
    }
    return {
        payload: getMinDiscrepancy(game.answers, submission),
        type: "LOSS",
    }
}
