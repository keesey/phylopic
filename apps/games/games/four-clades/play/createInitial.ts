import { getBuild, getImageByLink } from "~/lib/api"
import { Game } from "../models"
import { InitializeAction } from "./actions"
import { trimImage } from "./trimImage"
const isNotNull = <T>(x: T | null): x is T => x !== null
export const createInitial = async (game: Game): Promise<InitializeAction["payload"]> => {
    const build = await getBuild()
    const imageUUIDs = game.answers.flatMap(answer => answer.imageUUIDs).sort()
    const result = {
        numAnswers: game.answers.length,
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
            .map(image => trimImage(image)),
    } as InitializeAction["payload"]
    if (result.images.length !== imageUUIDs.length) {
        throw new Error("Could not retrieve all images.")
    }
    return result
}
