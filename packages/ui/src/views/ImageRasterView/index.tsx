import { ImageWithEmbedded, MediaLink } from "@phylopic/api-models"
import { ImageMediaType, URL } from "@phylopic/utils"
import Image from "next/future/image"
import React from "react"
import useImageAlt from "../../hooks/useImageAlt"
import useImageLoader from "../../hooks/useImageLoader"
import compareMediaLinks from "../../models/compareMediaLinks"
export interface ImageRasterViewProps {
    value: ImageWithEmbedded
}
const useLinkSize = (link: MediaLink<URL, ImageMediaType>) => {
    return React.useMemo(() => link.sizes.split("x", 2).map(size => parseInt(size, 10)), [link.sizes])
}
export const ImageRasterView: React.FC<ImageRasterViewProps> = ({ value }) => {
    const alt = useImageAlt(value)
    const loader = useImageLoader(value._links.rasterFiles)
    const smallestRasterFile = React.useMemo(
        () => [...value._links.rasterFiles].sort(compareMediaLinks)[0],
        [value._links.rasterFiles],
    )
    const [width, height] = useLinkSize(smallestRasterFile)
    return (
        <Image
            alt={alt}
            crossOrigin="anonymous"
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
