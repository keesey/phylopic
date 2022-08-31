import { FC, ReactNode, useEffect } from "react"
import useImageSpawn from "~/editing/useImageSpawn"
import { ICON_PLUS } from "../ICON_SYMBOLS"
import UserButton from "../UserButton"
export type Props = {
    children: ReactNode
}
const SpawnButton: FC<Props> = ({ children }) => {
    const [spawn, error, pending] = useImageSpawn()
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    return (
        <UserButton danger={pending} icon={ICON_PLUS} onClick={pending ? undefined : spawn}>
            {children}
        </UserButton>
    )
}
export default SpawnButton
