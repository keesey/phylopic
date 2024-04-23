import { Image as ImageModel, MediaLink } from "@phylopic/api-models"
import { ImageMediaType, URL } from "@phylopic/utils"
import NextImage from "next/image"
import React from "react"
import { getImageLoader } from "../../images"
import { compareMediaLinks } from "../../models"
// :KLUDGE: Next.js ESM issue.
let ResolvedImage = NextImage
if ("default" in ResolvedImage) {
    ResolvedImage = (ResolvedImage as unknown as { default: typeof NextImage }).default
}
export interface ImageRasterViewProps {
    value: ImageModel
}
const getLinkSize = (link: MediaLink<URL, ImageMediaType>) => {
    return link.sizes.split("x", 2).map(size => parseInt(size, 10))
}
export const ImageRasterView: React.FC<ImageRasterViewProps> = ({ value }) => {
    const loader = getImageLoader(value._links.rasterFiles, value.modifiedFile)
    const smallestRasterFile = [...value._links.rasterFiles].sort(compareMediaLinks)[0]
    const [width, height] = getLinkSize(smallestRasterFile)
    return (
        <ResolvedImage
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
