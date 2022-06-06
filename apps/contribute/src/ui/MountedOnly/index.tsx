import { FC, ReactNode, useEffect, useState } from "react"
import Loader from "~/ui/Loader"
type Props = {
    children: ReactNode
}
const MountedOnly: FC<Props> = ({ children }) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) {
        return <Loader />
    }
    return <>{children}</>
}
export default MountedOnly
