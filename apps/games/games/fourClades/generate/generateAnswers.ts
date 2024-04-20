import { List } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import {
    getCladeImages,
    getConcestorLink,
    getNodeByLink,
    getNodeLineage,
    getNodeList,
    isInList,
    pickRandomNode,
} from "~/lib/api"
import type { Answer } from "../models"
import { generateImages } from "./generateImages"
import { trimImage } from "./trimImage"
import { trimNode } from "./trimNode"
export const generateAnswers = async (build: number, minDepth: number, numAnswers: number, imagesPerAnswer: number) => {
    const list = await getNodeList(build)
    const answers = new Array<Answer>()
    for (let i = 0; i < numAnswers; ++i) {
        let cladeImages: List | null = null
        const ancestor = await pickRandomNode(list, async node => {
            cladeImages = await getCladeImages(node, { filter_license_nc: "false" })
            if (!cladeImages || imagesPerAnswer > cladeImages.totalItems) {
                return false
            }
            const lineage = await getNodeLineage(node)
            if (minDepth > lineage.totalItems) {
                return false
            }
            for (const answer of answers) {
                const [a, b] = await Promise.all([
                    isInList(answer.node, lineage),
                    isInList(node, await getNodeLineage(answer.node)),
                ])
                if (a || b) {
                    return false
                }
            }
            return true
        })
        if (!ancestor || !cladeImages) {
            throw new Error(`Could not find ${numAnswers} appropriate nodes for this game.`)
        }
        const previousImageUUIDs = answers.reduce<readonly UUID[]>(
            (prev, answer) => [...prev, ...answer.images.map(image => image.uuid)],
            [],
        )
        const images = await generateImages(cladeImages, imagesPerAnswer, previousImageUUIDs)
        const node = await getNodeByLink(await getConcestorLink(images.map(image => image._embedded.specificNode!)))
        if (!node) {
            throw new Error("Could not find concestor.")
        }
        answers.push({ images: images.map(image => trimImage(image)), node: trimNode(node) })
    }
    return answers
}
