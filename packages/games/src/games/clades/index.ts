import { ImageWithEmbedded, List, NodeWithEmbedded } from "@phylopic/api-models"
import { getCladeImages } from "../../utils/getCladeImages"
import { getNodeLineage } from "../../utils/getNodeLineage"
import { getNodeList } from "../../utils/getNodeList"
import { isInList } from "../../utils/isInList"
import { pickRandomNode } from "../../utils/pickRandomNode"
import { pickRandomImage } from "../../utils/pickRandomImage"
import { UUID } from "@phylopic/utils"
export type CladesAnswer = Readonly<{
    images: readonly ImageWithEmbedded[]
    node: NodeWithEmbedded
}>
export type CladesGame = Readonly<{
    answers: readonly CladesAnswer[]
}>
const getImages = async (list: List, numImages: number, previousImageUUIDs: readonly UUID[]) => {
    const images = new Array(numImages)
    for (let i = 0; i < numImages; ++i) {
        const image = await pickRandomImage(list, async image => {
            if (previousImageUUIDs.includes(image.uuid) || images.some(otherImage => otherImage.uuid === image.uuid)) {
                return false
            }
            return true
        })
        if (!image) {
            throw new Error(`Could not find ${numImages} in list: ${list._links.self.href}`)
        }
        images[i] = image
    }
    return images
}
const getAnswers = async (build: number | undefined, minDepth: number, numSets: number, imagesPerClade: number) => {
    const list = await getNodeList(build)
    const answers = new Array<CladesAnswer>(numSets)
    for (let i = 0; i < numSets; ++i) {
        let cladeImages: List | null = null
        const node = await pickRandomNode(list, async node => {
            cladeImages = await getCladeImages(node)
            if (!cladeImages || imagesPerClade > cladeImages.totalItems) {
                return false
            }
            const lineage = await getNodeLineage(node)
            if (minDepth < lineage.totalItems) {
                return false
            }
            for (const answer of answers) {
                if (await isInList(answer.node, lineage)) {
                    return false
                }
            }
            return true
        })
        if (!node || !cladeImages) {
            throw new Error(`Could not find ${numSets} appropriate nodes for this game.`)
        }
        const previousImageUUIDs = answers.reduce<readonly UUID[]>(
            (prev, answer) => [...prev, ...answer.images.map(image => image.uuid)],
            [],
        )
        answers[i] = {
            node,
            images: await getImages(cladeImages, imagesPerClade, previousImageUUIDs),
        }
    }
    return answers
}
export async function getClades(build?: number, minDepth = 6, numSets = 4, imagesPerClade = 4) {
    const answers = await getAnswers(build, minDepth, numSets, imagesPerClade)
    return { answers } as CladesGame
}
