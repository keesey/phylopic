import { useRouter } from "next/router"
import { FC, ReactNode, useEffect, useState } from "react"
import useAuthorized from "./hooks/useAuthorized"
import useExpireEffect from "./hooks/useExpireEffect"
type Props = {
    children: ReactNode
}
const AuthorizedOnly: FC<Props> = ({ children }) => {
    const authorized = useAuthorized()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    useEffect(() => {
        if (mounted && !authorized) {
            router.push("/")
        }
    }, [authorized, mounted, router])
    useExpireEffect(1000)
    return <>{children}</>
}
export default AuthorizedOnly
