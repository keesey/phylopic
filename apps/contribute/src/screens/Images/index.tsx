import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import FullScreen from "~/pages/screenTypes/FullScreen"
import { ImageFilter } from "~/pagination/ImageFilter"
import ImagePaginator from "~/pagination/ImagePaginator"
import ImageGrid from "~/ui/ImageGrid"
import ImageThumbnailView from "~/ui/ImageThumbnailView"
export type Props = {
    filter: ImageFilter
}
const Images: FC<Props> = ({ filter }) => {
    return (
        <FullScreen>
            <ImagePaginator filter={filter}>
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
