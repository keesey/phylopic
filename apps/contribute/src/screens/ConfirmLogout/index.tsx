import { FC, useCallback, useContext } from "react"
import AuthContext from "~/auth/AuthContext"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
const ConfirmLogout: FC = () => {
    const [, setToken] = useContext(AuthContext) ?? []
    const handleLogOutButtonClick = useCallback(() => {
        setToken?.(null)
        localStorage.removeItem("auth")
    }, [setToken])
    return (
        <Dialogue>
            <Speech mode="system">
                <p>Are you sure you want to log out?</p>
            </Speech>
            <UserOptions>
                <UserButton danger onClick={handleLogOutButtonClick}>
                    Yes, log me out.
                </UserButton>
                <UserLinkButton href="/">No, I changed my mind.</UserLinkButton>
            </UserOptions>
        </Dialogue>
    )
}
export default ConfirmLogout
