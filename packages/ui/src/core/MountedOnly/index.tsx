import { FC, ReactNode, useEffect, useState } from "react"
import Loader from "../Loader"
export type MountedOnlyProps = {
    children: ReactNode
}
export const MountedOnly: FC<MountedOnlyProps> = ({ children }) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) {
        return <Loader />
    }
    return <>{children}</>
}
export default MountedOnly
