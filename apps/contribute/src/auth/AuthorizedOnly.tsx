import { FC, ReactNode, useEffect, useState } from "react"
import Registration from "~/screens_legacy/Registration"
import useAuthorized from "./hooks/useAuthorized"
type Props = {
    children: ReactNode
}
const AuthorizedOnly: FC<Props> = ({ children }) => {
    const authorized = useAuthorized()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) {
        return null
    }
    if (!authorized) {
        return <Registration />
    }
    return <>{children}</>
}
export default AuthorizedOnly
