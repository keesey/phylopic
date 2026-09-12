import { getBuild, getImageByLink } from "~/lib/api"
import { shuffle } from "~/lib/utils"
import { Game } from "../models"
import { BoardState } from "./BoardState"
import { trimImage } from "./trimImage"
const isNotNull = <T>(x: T | null): x is T => x !== null
export const fromModel = async (game: Game): Promise<BoardState> => {
    const build = await getBuild()
    const imageUUIDs = game.answers.flatMap(answer => answer.imageUUIDs).sort()
    const result = {
        answers: [],
        discrepancy: 0,
        imageUUIDs: shuffle(imageUUIDs),
        images: [
            ...(await Promise.all(
                imageUUIDs.map(
                    async imageUUID =>
                        await getImageByLink(
                            { href: `/images/${encodeURIComponent(imageUUID)}` },
                            { build, embed_specificNode: "true" },
                        ),
                ),
            )),
        ]
            .filter(isNotNull)
            .reduce<BoardState["images"]>(
                (prev, image) => ({
                    ...prev,
                    [image.uuid]: {
                        image: trimImage(image),
                        mode: null,
                    },
                }),
                {},
            ),
        lastSubmission: [],
        mistakes: 0,
        totalAnswers: game.answers.length,
    }
    if (Object.keys(result.images).length !== imageUUIDs.length) {
        throw new Error("Could not retrieve all images.")
    }
    return result
}
