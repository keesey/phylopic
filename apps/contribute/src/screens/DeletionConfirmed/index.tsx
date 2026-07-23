import { FC } from "react"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_RIGHT, ICON_HAND_POINT_RIGHT, ICON_PLUS } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
const DeletionConfirmed: FC = () => {
    return (
        <Dialogue>
            <Speech mode="system">
                <p>Well, that&rsquo;s done. It&rsquo;s been deleted.</p>
                <p>What would you like to do?</p>
            </Speech>
            <UserOptions>
                <UserLinkButton icon={ICON_PLUS} href="/upload">
                    Upload a new image.
                </UserLinkButton>
                <UserLinkButton icon={ICON_ARROW_RIGHT} href="/submissions">
                    View my current submissions.
                </UserLinkButton>
                <UserLinkButton icon={ICON_ARROW_RIGHT} href="/images">
                    View my accepted submissions.
                </UserLinkButton>
                <UserLinkButton icon={ICON_HAND_POINT_RIGHT} href={process.env.NEXT_PUBLIC_WWW_URL ?? ""}>
                    Check out the site.
                </UserLinkButton>
            </UserOptions>
        </Dialogue>
    )
}
export default DeletionConfirmed
