import { FC } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
const CheckEmail: FC = () => (
    <DialogueScreen>
        <p>
            Your authorization link has been sent! Check your inbox for an email from <i>PhyloPic Contributions</i>.
        </p>
        <p>You may close this page. See you soon!</p>
    </DialogueScreen>
)
export default CheckEmail
