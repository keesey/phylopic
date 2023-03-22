import { Image } from "@phylopic/api-models"
import NextImage from "next/image"
import React from "react"
import useImageLoader from "../../hooks/useImageLoader"
export interface ImageThumbnailViewProps {
    value: Image
}
export const ImageThumbnailView: React.FC<ImageThumbnailViewProps> = ({ value }) => {
    const loader = useImageLoader(value._links.thumbnailFiles)
    return <NextImage alt={value._links.self.title} height={64} loader={loader} src={value.uuid} width={64} />
}
export default ImageThumbnailView
