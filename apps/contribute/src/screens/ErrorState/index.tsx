import { useRouter } from "next/router"
import { FC, ReactNode, useCallback } from "react"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_LEFT } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
export type Props = {
    children?: ReactNode
}
const ErrorState: FC<Props> = ({ children }) => {
    const router = useRouter()
    const handleUserButtonClick = useCallback(() => {
        router.reload()
    }, [router])
    return (
        <Dialogue>
            <Speech mode="system">
                <h2>Error!</h2>
                {children}
            </Speech>
            <UserOptions>
                <UserButton icon={ICON_ARROW_LEFT} onClick={handleUserButtonClick}>
                    Start over.
                </UserButton>
            </UserOptions>
        </Dialogue>
    )
}
export default ErrorState
