import { Loader } from "@phylopic/ui"
import { FC, ReactNode, useEffect } from "react"
import useImageSpawn from "~/editing/hooks/useImageSpawn"
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
        <UserButton icon={ICON_PLUS} onClick={pending ? undefined : spawn}>
            {children}
            {pending && <Loader />}
        </UserButton>
    )
}
export default SpawnButton
