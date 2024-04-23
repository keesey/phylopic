import { ImageWithEmbedded } from "@phylopic/api-models"
import { UUID, extractPath, isDefined, isUUIDv4 } from "@phylopic/utils"
import { getConcestorLink, getImageByLink } from "~/lib/api"
import { Game } from "../models"
export const replace = async (game: Game, imageUUID: UUID, newImage: ImageWithEmbedded) => {
    if (!isUUIDv4(imageUUID)) {
        throw new Error("Invalid image UUID.")
    }
    if (game.answers.some(answer => answer.imageUUIDs.includes(newImage.uuid))) {
        throw new Error("Image already included.")
    }
    const answerIndex = game.answers.findIndex(answer => answer.imageUUIDs.includes(imageUUID))
    if (answerIndex < 0) {
        throw new Error("Cannot find the image to replace.")
    }
    const oldAnswer = game.answers[answerIndex]
    const imageIndex = oldAnswer.imageUUIDs.indexOf(imageUUID)
    const newImageUUIDS = [...oldAnswer.imageUUIDs]
    newImageUUIDS.splice(imageIndex, 1, newImage.uuid)
    const images = (
        await Promise.all(
            newImageUUIDS.map(uuid =>
                uuid === imageUUID
                    ? Promise.resolve(newImage)
                    : getImageByLink({ href: `/images/${encodeURIComponent(uuid)}` }, { embed_specificNode: "true" }),
            ),
        )
    ).filter(isDefined)
    const newNodeLink = await getConcestorLink(images.map(image => image._embedded.specificNode!))
    if (!newNodeLink) {
        throw new Error("Could not determine concestor.")
    }
    const newNodeUUID = extractPath(newNodeLink.href).split("/").filter(Boolean).pop()
    if (!isUUIDv4(newNodeUUID)) {
        throw new Error("Could not determine concestor's UUID.")
    }
    const newAnswers = [...game.answers]
    newAnswers.splice(answerIndex, 1, {
        imageUUIDs: newImageUUIDS,
        nodeUUID: newNodeUUID,
    })
    return { answers: newAnswers }
}
