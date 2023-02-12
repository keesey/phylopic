import { Image, ImageWithEmbedded } from "@phylopic/api-models"
import { useImageAlt } from "@phylopic/ui"
import { OpenGraph } from "next-seo/lib/types"
import { useMemo } from "react"
const useOpenGraphForImage = (image: Image | ImageWithEmbedded | null | undefined): OpenGraph | undefined => {
    const alt = useImageAlt(image)
    return useMemo(() => {
        if (!image) {
            return undefined
        }
        const media = image._links["http://ogp.me/ns#image"]
        const [width, height] = media.sizes.split("x").map(part => parseInt(part, 10))
        return {
            images: [
                {
                    alt,
                    height,
                    type: media.type,
                    url: media.href,
                    width,
                },
            ],
        }
    }, [alt, image])
}
export default useOpenGraphForImage
