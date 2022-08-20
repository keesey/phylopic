import { FC } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import ImagePaginator from "~/pagination/ImagePaginator"
import Speech from "~/ui/Speech"
import UserImageThumbnail from "~/ui/UserImageThumbnail"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
const Incomplete: FC = () => {
    const incomplete = useImageCount("incomplete")
    return (
        <>
            <Speech mode="system">
                <p>
                    Looks like you have some unfinished business. Click on{" "}
                    {incomplete === 1 ? "the image" : "one of the images"} below to continue.
                </p>
            </Speech>
            <UserOptions>
                <ImagePaginator filter="incomplete">
                    {images => (
                        <>
                            {images.map(image => (
                                <UserLinkButton key={image.uuid} href={`/edit/${encodeURIComponent(image.uuid)}`}>
                                    <UserImageThumbnail uuid={image.uuid} />
                                </UserLinkButton>
                            ))}
                        </>
                    )}
                </ImagePaginator>
            </UserOptions>
        </>
    )
}
export default Incomplete
