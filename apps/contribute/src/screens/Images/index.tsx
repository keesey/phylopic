import { FC, ReactNode } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import { ImageFilter } from "~/pagination/ImageFilter"
import ImagePaginator from "~/pagination/ImagePaginator"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
import UserImageThumbnail from "~/ui/UserImageThumbnail"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    children: (total: number | undefined) => ReactNode
    filter: ImageFilter
}
const Images: FC<Props> = ({ children, filter }) => {
    const total = useImageCount(filter)
    return (
        <Dialogue>
            <Speech mode="system">{children(total)}</Speech>
            <UserOptions noAutoScroll>
                <ImagePaginator key="images" filter={filter}>
                    {images =>
                        images.map(image => (
                            <UserLinkButton key={image.uuid} href={`/edit/${encodeURIComponent(image.uuid)}`}>
                                <UserImageThumbnail uuid={image.uuid} />
                            </UserLinkButton>
                        ))
                    }
                </ImagePaginator>
            </UserOptions>
        </Dialogue>
    )
}
export default Images
