import { isImageWithEmbedded } from "@phylopic/api-models"
import { UUID, ValidationFault, extractPath } from "@phylopic/utils"
import { getConcestorLink, getImageByLink } from "~/lib/api"
import { Game } from "../models"
export const validate = async (game: Game): Promise<readonly ValidationFault[]> => {
    const faults: ValidationFault[] = []
    try {
        if (!game?.answers?.length) {
            faults.push({
                field: "answers",
                message: "No answers.",
            })
        } else {
            const imagesPerAnswer = game.answers[0].imageUUIDs.length
            if (!(imagesPerAnswer > 0)) {
                faults.push({
                    field: "answers[0]",
                    message: "No images in answer.",
                })
            } else {
                game.answers.forEach((answer, index) => {
                    if (answer.imageUUIDs.length !== imagesPerAnswer) {
                        faults.push({
                            field: `answers[${index}]`,
                            message: "Incorrect number of answers.",
                        })
                    }
                })
            }
            const imageUUIDs = new Set<UUID>(
                game.answers.flatMap(answer => answer.imageUUIDs),
            )
            const expectedSize = game.answers.length * imagesPerAnswer
            if (imageUUIDs.size < expectedSize) {
                faults.push({
                    field: "answers",
                    message: "Duplicate images.",
                })
            }
            if (imageUUIDs.size !== expectedSize) {
                faults.push({
                    field: "answers",
                    message: "Incorrect total number of images.",
                })
            }
            if (!faults.length) {
                await Promise.all(
                    game.answers.map(async (answer, index) => {
                        const images = (await Promise.all(answer.imageUUIDs.map(imageUUID => getImageByLink({ href: `/images/${encodeURIComponent(imageUUID)}`}, { embed_specificNode: "true" })))).filter(image => isImageWithEmbedded(image))
                        if (images.length !== imagesPerAnswer) {
                            faults.push({
                                field: `answers[${index}].imageUUIDs`,
                                message: "Could not find one or more images.",
                            })
                        }
                        const nodeLink = await getConcestorLink(
                            images.map(image => image?._embedded.specificNode!),
                        )
                        if (extractPath(nodeLink?.href ?? "") !== `/nodes/${encodeURIComponent(answer.nodeUUID)}`) {
                            faults.push({
                                field: `answers[${index}].nodeUUID`,
                                message: "Incorrect node for images in answer.",
                            })
                        }
                    }),
                )
            }
        }
    } catch (e) {
        faults.push({
            field: "answers",
            message: String(e),
        })
    }
    return faults
}
