import Image from "next/image"
import { ImageMediaType, ImageWithEmbedded, MediaLink, URL } from "@phylopic/api-models"
import { useMemo, FC } from "react"
import useImageAlt from "~/hooks/useImageAlt"
import useImageLoader from "~/hooks/useImageLoader"
import compareMediaLinks from "~/models/compareMediaLinks"
import styles from "./index.module.scss"
export interface Props {
    value: ImageWithEmbedded
}
const useLinkSize = (link: MediaLink<URL, ImageMediaType>) => {
    return useMemo(() => link.sizes.split("x", 2).map(size => parseInt(size, 10)), [link.sizes])
}
const ImageRasterView: FC<Props> = ({ value }) => {
    const alt = useImageAlt(value)
    const loader = useImageLoader(value._links.rasterFiles)
    const smallestRasterFile = useMemo(
        () => [...value._links.rasterFiles].sort(compareMediaLinks)[0],
        [value._links.rasterFiles],
    )
    const [width, height] = useLinkSize(smallestRasterFile)
    return (
        <div className={styles.main}>
            <figure className={styles.figure}>
                <Image
                    alt={alt}
                    crossOrigin="anonymous"
                    height={height}
                    loader={loader}
                    layout="intrinsic"
                    src={value.uuid}
                    width={width}
                />
            </figure>
        </div>
    )
}
export default ImageRasterView
