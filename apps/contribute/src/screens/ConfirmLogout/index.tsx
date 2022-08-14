import Link from "next/link"
import { FC, useCallback, useContext } from "react"
import AuthContext from "~/auth/AuthContext"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
const ConfirmLogout: FC = () => {
    const [, setToken] = useContext(AuthContext) ?? []
    const handleLogOutButtonClick = useCallback(() => {
        setToken?.(null)
        localStorage.removeItem("auth")
    }, [setToken])
    return (
        <DialogueScreen>
            <p>Are you sure you want to log out?</p>
            <button className="cta" onClick={handleLogOutButtonClick}>
                Yes, log me out.
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
