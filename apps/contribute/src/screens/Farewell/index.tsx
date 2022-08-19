import { FC } from "react"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_RIGHT } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
const Farewell: FC = () => {
    return (
        <Dialogue>
            <Speech mode="system">
                <p>You have logged out.</p>
            </Speech>
            <UserOptions>
                <UserLinkButton icon={ICON_ARROW_RIGHT} href="/">Log me back in.</UserLinkButton>
            </UserOptions>
        </Dialogue>
    )
}
export default Farewell
