import { FC } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { ICON_ARROW_RIGHT, ICON_PLUS } from "~/ui/ICON_SYMBOLS"
import NumberAsWords from "~/ui/NumberAsWords"
import Speech from "~/ui/Speech"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
const Images: FC = () => {
    const fetcher = useAuthorizedJSONFetcher<number>()
    const { data: numImages } = useSWR("/api/images?total=items", fetcher)
    return (
        <>
            <Speech mode="system">
                {typeof numImages === "number" && (
                    <p>
                        You have{" "}
                        <strong>
                            <NumberAsWords max={100} value={numImages} />
                        </strong>{" "}
                        accepted submission{numImages === 1 ? "" : "s"}.
                        {numImages >= 8 && (
                            <>
                                {" "}
                                <strong>Impressive!</strong>
                            </>
                        )}
                    </p>
                )}
            </Speech>
            <UserOptions noAutoScroll>
                <UserLinkButton icon={ICON_ARROW_RIGHT} href="/images">
                    Let&rsquo;s check them out.
                </UserLinkButton>
                <UserLinkButton icon={ICON_PLUS} href="/upload">
                    Upload a new image.
                </UserLinkButton>
            </UserOptions>
        </>
    )
}
export default Images
