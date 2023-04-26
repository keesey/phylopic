import { Image, ImageWithEmbedded } from "@phylopic/api-models"
import { OpenGraph } from "next-seo/lib/types"
import { useMemo } from "react"
const useOpenGraphForImage = (image: Image | ImageWithEmbedded | null | undefined): OpenGraph | undefined => {
    return useMemo(() => {
        if (!image) {
            return undefined
        }
        const media = image._links["http://ogp.me/ns#image"]
        const [width, height] = media.sizes.split("x").map(part => parseInt(part, 10))
        return {
            images: [
                {
                    alt: image._links.self.title,
                    height,
                    type: media.type,
                    url: media.href,
                    width,
                },
            ],
            siteName: "PhyloPic",
        } as OpenGraph
    }, [image])
}
export default useOpenGraphForImage
