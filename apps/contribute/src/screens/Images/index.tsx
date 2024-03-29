import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC, ReactNode } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import Paginator from "~/pagination/Paginator"
import Dialogue from "~/ui/Dialogue"
import { ICON_PLUS } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserImageThumbnail from "~/ui/UserImageThumbnail"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    children: (total: number | undefined) => ReactNode
}
const Images: FC<Props> = ({ children }) => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    const { data: total } = useSWR("/api/images?total=items", fetcher)
    return (
        <Dialogue>
            <Speech mode="system">{children(total)}</Speech>
            <Paginator key="images" endpoint="/api/images">
                {images => (
                    <>
                        <br />
                        <UserOptions noAutoScroll>
                            {(images as ReadonlyArray<Image & { uuid: UUID }>).map(image => (
                                <UserImageThumbnail key={image.uuid} uuid={image.uuid} />
                            ))}
                        </UserOptions>
                    </>
                )}
            </Paginator>
            {total === 0 && (
                <UserOptions>
                    <UserLinkButton icon={ICON_PLUS} href="/upload">
                        Upload a silhouette.
                    </UserLinkButton>
                </UserOptions>
            )}
        </Dialogue>
    )
}
export default Images
