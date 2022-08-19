import { AnchorLink } from "@phylopic/ui"
import { FC, ReactNode } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import { ImageFilter } from "~/pagination/ImageFilter"
import ImagePaginator from "~/pagination/ImagePaginator"
import Dialogue from "~/ui/Dialogue"
import ImageGrid from "~/ui/ImageGrid"
import ImageThumbnailView from "~/ui/ImageThumbnailView"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    children: (total: number | undefined) => ReactNode
    filter: ImageFilter
}
const Images: FC<Props> = ({ children, filter }) => {
    const total = useImageCount(filter)
    return (
        <>
            {children(total)}
            <ImagePaginator key="images" filter={filter}>
                {images => (
                    <>
                        <Dialogue>
                            <UserOptions>
                                <UserLinkButton href="/">← Return to Overview.</UserLinkButton>
                            </UserOptions>
                        </Dialogue>
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
        </>
    )
}
export default Images
