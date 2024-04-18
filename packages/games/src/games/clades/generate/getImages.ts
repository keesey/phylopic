import type { ImageWithEmbedded, List } from "@phylopic/api-models"
import type { UUID } from "@phylopic/utils"
import { pickRandomImage } from "../../../utils"
export const getImages = async (
    list: List,
    numImages: number,
    previousImageUUIDs: readonly UUID[],
): Promise<readonly ImageWithEmbedded[]> => {
    const images = new Array<ImageWithEmbedded>(numImages)
    for (let i = 0; i < numImages; ++i) {
        const image = await pickRandomImage(
            list,
            async image => {
                if (
                    previousImageUUIDs.includes(image.uuid) ||
                    images.some(otherImage => otherImage.uuid === image.uuid)
                ) {
                    return false
                }
                return true
            },
            { embed_specificNode: "true" },
        )
        if (!image) {
            throw new Error(`Could not find ${numImages} in list: ${list._links.self.href}`)
        }
        images[i] = image
    }
    return images
}
