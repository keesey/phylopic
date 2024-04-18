import { type Image } from "@phylopic/api-models"
import NextImage from "next/image"
import React from "react"
import { useImageLoader } from "../../hooks/useImageLoader"
// :KLUDGE: Next.js ESM issue.
let ResolvedImage = NextImage
if ("default" in ResolvedImage) {
    ResolvedImage = (ResolvedImage as unknown as { default: typeof NextImage }).default
}
export interface ImageThumbnailViewProps {
    value: Pick<Image, "modifiedFile" | "uuid"> &
        Readonly<{
            _links: Pick<Image["_links"], "self" | "thumbnailFiles">
        }>
}
export const ImageThumbnailView: React.FC<ImageThumbnailViewProps> = ({ value }) => {
    const loader = useImageLoader(value._links.thumbnailFiles, value.modifiedFile)
    return <ResolvedImage alt={value._links.self.title} height={64} loader={loader} src={value.uuid} width={64} />
}
