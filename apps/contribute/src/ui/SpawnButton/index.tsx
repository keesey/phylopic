import { Loader, LoaderContext } from "@phylopic/ui"
import { FC, ReactNode, useEffect } from "react"
import useImageSpawn from "~/editing/hooks/useImageSpawn"
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
    return <UserButton onClick={pending ? undefined : spawn}>{pending ? <Loader /> : <>{children}</>}</UserButton>
}
export default SpawnButton
