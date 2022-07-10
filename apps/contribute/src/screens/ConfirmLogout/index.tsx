import Link from "next/link"
import { FC } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
export type Props = {
    onConfirm?: () => void
}
const ConfirmLogout: FC<Props> = ({ onConfirm }) => {
    return (
        <DialogueScreen>
            <p>Are you sure you want to log out?</p>
            <button className="cta" onClick={onConfirm}>
                Yes, Log Me Out
            </button>
            <p>
                <Link href="/">
                    <a className="text">No, I changed my mind.</a>
                </Link>
            </p>
        </DialogueScreen>
    )
}
export default ConfirmLogout
