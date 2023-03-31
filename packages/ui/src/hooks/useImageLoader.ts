import { MediaLink } from "@phylopic/api-models"
import { ISOTimestamp, RasterMediaType, URL } from "@phylopic/utils"
import type { ImageLoader } from "next/image"
import { useCallback } from "react"
const findBestSize = (links: readonly MediaLink<URL, RasterMediaType>[], width: number) => {
    const linksByWidth = links
        .map(link => ({ link, width: parseInt(link.sizes.split("x", 2)[0], 10) }))
        .sort((a, b) => a.width - b.width)
    const best = linksByWidth.find(({ width: linkWidth }) => linkWidth >= width)
    if (best) {
        return best.link.href
    }
    return linksByWidth[linksByWidth.length - 1].link.href
}
export const useImageLoader = (links: readonly MediaLink<URL, RasterMediaType>[], modified?: ISOTimestamp) => {
    return useCallback<ImageLoader>(
        props => findBestSize(links, props.width) + (modified ? `?v=${new Date(modified).valueOf().toString(16)}` : ""),
        [links, modified],
    )
}
export default useImageLoader
