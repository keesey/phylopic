import { FC } from "react"
import { ICON_PLUS } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
const Prompt: FC = () => {
    return (
        <>
            <Speech mode="system">
                <p>Ready to get started?</p>
            </Speech>
            <UserOptions>
                <UserLinkButton icon={ICON_PLUS} href="/upload">
                    Upload a silhouette image.
                </UserLinkButton>
            </UserOptions>
        </>
    )
}
export default Prompt
