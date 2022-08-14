import { AnchorLink } from "@phylopic/ui"
import { FC, ReactNode } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import FullScreen from "~/pages/screenTypes/FullScreen"
import { ImageFilter } from "~/pagination/ImageFilter"
import ImagePaginator from "~/pagination/ImagePaginator"
import ImageGrid from "~/ui/ImageGrid"
import ImageThumbnailView from "~/ui/ImageThumbnailView"
export type Props = {
    children: (total: number | undefined) => ReactNode
    filter: ImageFilter
}
const Images: FC<Props> = ({ children, filter }) => {
    const total = useImageCount(filter)
    return (
        <FullScreen>
            {children(total)}
            <ImagePaginator key="images" filter={filter}>
                {images => (
                    <>
                        <p>
                            <AnchorLink href="/" className="text">
                                ← Return to Home Screen.
                            </AnchorLink>
                        </p>
                        <ImageGrid>
                            {images.map(image => (
                                <AnchorLink key={image.uuid} href={`/edit/${encodeURIComponent(image.uuid)}`}>
                                    <ImageThumbnailView value={image} />
                                </AnchorLink>
                            ))}
                        </ImageGrid>
                    </>
                )}
            </ImagePaginator>
        </FullScreen>
    )
}
export default Images
