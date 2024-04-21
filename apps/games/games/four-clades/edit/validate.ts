import { Entity } from "@phylopic/api-models"
import { UUID, ValidationFault, extractQueryString, parseQueryString } from "@phylopic/utils"
import { getConcestorLink } from "~/lib/api"
import { Game } from "../models"
const getBuildFromEntity = (entity: Pick<Entity, "_links">) =>
    parseQueryString(extractQueryString(entity._links.self.href)).build
export const validate = async (game: Game): Promise<readonly ValidationFault[]> => {
    const faults: ValidationFault[] = []
    try {
        if (!game?.answers?.length) {
            faults.push({
                field: "answers",
                message: "No answers.",
            })
        } else {
            const imagesPerAnswer = game.answers[0].images.length
            if (!(imagesPerAnswer > 0)) {
                faults.push({
                    field: "answers[0]",
                    message: "No images in answer.",
                })
            } else {
                game.answers.forEach((answer, index) => {
                    if (answer.images.length !== imagesPerAnswer) {
                        faults.push({
                            field: `answers[${index}]`,
                            message: "Incorrect number of answers.",
                        })
                    }
                })
            }
            const imageUUIDs = new Set<UUID>(
                game.answers.reduce<UUID[]>((prev, answer) => [...prev, ...answer.images.map(image => image.uuid)], []),
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
            const allBuilds = new Set<string | undefined>(
                [...game.answers.map(answer => answer.node), ...game.answers.flatMap(answer => answer.images)].map(
                    entity => getBuildFromEntity(entity),
                ),
            )
            if (allBuilds.size !== 1) {
                faults.push({
                    field: "answers",
                    message: "Inconsistent builds.",
                })
            }
            if (!faults.length) {
                await Promise.all(
                    game.answers.map(async (answer, index) => {
                        const nodeLink = await getConcestorLink(
                            answer.images.map(image => image._embedded.specificNode!),
                        )
                        if (nodeLink?.href !== answer.node._links.self.href) {
                            faults.push({
                                field: `answers[${index}].node`,
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
