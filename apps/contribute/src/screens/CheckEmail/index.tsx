import { FC } from "react"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_RIGHT } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import type { TTL } from "~/ui/TTLSelector/TTL"
import TTLView from "~/ui/TTLView"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    ttl: TTL
}
const CheckEmail: FC<Props> = ({ ttl }) => (
    <Dialogue>
        <Speech mode="system">
            <p>
                Check your inbox for an email from <i>&ldquo;PhyloPic Contributions&rdquo;</i>
                . Click on the link in that email within the next <TTLView value={ttl} />.
            </p>
            <p>You may close this page. See you soon!</p>
        </Speech>
        <UserOptions>
            <UserLinkButton icon={ICON_ARROW_RIGHT} href={process.env.NEXT_PUBLIC_WWW_URL + "/"}>
                Check out the site.
            </UserLinkButton>
        </UserOptions>
    </Dialogue>
)
export default CheckEmail
