import { Image, ImageWithEmbedded } from "@phylopic/api-models"
import NextImage from "next/future/image"
import React from "react"
import useImageAlt from "../../hooks/useImageAlt"
import useImageLoader from "../../hooks/useImageLoader"
export interface ImageThumbnailViewProps {
    value: Image | ImageWithEmbedded
}
export const ImageThumbnailView: React.FC<ImageThumbnailViewProps> = ({ value }) => {
    const alt = useImageAlt(value)
    const loader = useImageLoader(value._links.thumbnailFiles)
    return <NextImage alt={alt} height={64} loader={loader} src={value.uuid} width={64} />
}
export default ImageThumbnailView
