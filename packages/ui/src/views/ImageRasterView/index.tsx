import { Image as ImageModel, MediaLink } from "@phylopic/api-models"
import { ImageMediaType, URL } from "@phylopic/utils"
import Image from "next/image"
import React from "react"
import useImageLoader from "../../hooks/useImageLoader"
import compareMediaLinks from "../../models/compareMediaLinks"
export interface ImageRasterViewProps {
    value: ImageModel
}
const useLinkSize = (link: MediaLink<URL, ImageMediaType>) => {
    return React.useMemo(() => link.sizes.split("x", 2).map(size => parseInt(size, 10)), [link.sizes])
}
export const ImageRasterView: React.FC<ImageRasterViewProps> = ({ value }) => {
    const loader = useImageLoader(value._links.rasterFiles)
    const smallestRasterFile = React.useMemo(
        () => [...value._links.rasterFiles].sort(compareMediaLinks)[0],
        [value._links.rasterFiles],
    )
    const [width, height] = useLinkSize(smallestRasterFile)
    return (
        <Image
            alt={value._links.self.title}
            height={height}
            loader={loader}
            priority
            src={value.uuid}
            style={{ maxWidth: "calc(100vw - 112px)", objectFit: "scale-down" }}
            width={width}
        />
    )
}
export default ImageRasterView
