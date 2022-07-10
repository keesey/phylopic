import { FC } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import SiteTitle from "~/ui/SiteTitle"
const CheckEmail: FC = () => (
    <DialogueScreen>
        <p>
            Check your inbox for an email from <i>PhyloPic Contributions</i>.
        </p>
        <p>You may close this page. See you soon!</p>
        <a className="text" href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/`}>
            Check out <SiteTitle />.
        </a>
    </DialogueScreen>
)
export default CheckEmail
