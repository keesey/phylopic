import React from "react"
import Loader from "../Loader"
export type MountedOnlyProps = {
    children: React.ReactNode
}
export const MountedOnly: React.FC<MountedOnlyProps> = ({ children }) => {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    if (!mounted) {
        return <Loader />
    }
    return <>{children}</>
}
export default MountedOnly
