import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import ImagePaginator from "~/pagination/ImagePaginator"
import ImageGrid from "~/ui/ImageGrid"
import ImageThumbnailView from "~/ui/ImageThumbnailView"
const Incomplete: FC = () => {
    const incomplete = useImageCount("incomplete")
    return (
        <>
            <p>
                Looks like you have some unfinished business. Click on{" "}
                {incomplete === 1 ? "the image" : "one of the images"} below to continue.
            </p>
            <ImagePaginator filter="incomplete">
                {images => (
                    <ImageGrid>
                        {images.map(image => (
                            <AnchorLink key={image.uuid} href={`/images/${encodeURIComponent(image.uuid)}`}>
                                <ImageThumbnailView value={image} />
                            </AnchorLink>
                        ))}
                    </ImageGrid>
                )}
            </ImagePaginator>
        </>
    )
}
export default Incomplete
