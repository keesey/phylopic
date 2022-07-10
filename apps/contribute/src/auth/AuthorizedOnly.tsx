import { useRouter } from "next/router"
import { FC, ReactNode, useEffect } from "react"
import useAuthorized from "./hooks/useAuthorized"
type Props = {
    children: ReactNode
}
const AuthorizedOnly: FC<Props> = ({ children }) => {
    const authorized = useAuthorized()
    const router = useRouter()
    useEffect(() => {
        if (!authorized) {
            router.push("/")
        }
    }, [authorized, router])
    return <>{children}</>
}
export default AuthorizedOnly
