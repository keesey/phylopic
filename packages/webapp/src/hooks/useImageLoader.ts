import { MediaLink } from "@phylopic/api-models"
import { RasterMediaType, URL } from "@phylopic/utils/dist/models/types"
import { ImageLoader } from "next/image"
import { useCallback, useContext, useMemo } from "react"
import BuildContext from "~/builds/BuildContext"
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
const useImageLoader = (links: readonly MediaLink<URL, RasterMediaType>[]) => {
    const [ifMatch] = useContext(BuildContext) ?? []
    const query = useMemo(() => (ifMatch ? `?build=${encodeURIComponent(ifMatch)}` : ""), [ifMatch])
    return useCallback<ImageLoader>(props => findBestSize(links, props.width) + query, [links, query])
}
export default useImageLoader
