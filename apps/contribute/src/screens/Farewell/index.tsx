import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
const Farewell: FC = () => {
    return (
        <DialogueScreen>
            <p>You have logged out.</p>
            <AnchorLink href="/" className="cta">
                Log me back in
            </AnchorLink>
        </DialogueScreen>
    )
}
export default Farewell
