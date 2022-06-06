import { FC, useContext, useEffect } from "react"
import AuthContext from "~/auth/AuthContext"
import useAuthorized from "~/auth/hooks/useAuthorized"
import AnchorLink from "~/ui/AnchorLink"
import Loader from "~/ui/Loader"
const Farewell: FC = () => {
    const [, setJWT] = useContext(AuthContext) ?? []
    const authorized = useAuthorized()
    useEffect(() => {
        if (authorized) {
            setJWT?.(undefined)
        }
    }, [authorized, setJWT])
    if (authorized) {
        return <Loader />
    }
    return (
        <section>
            <p>So long, then!</p>
            <AnchorLink href="/" className="cta">
                Wait, log back in
            </AnchorLink>
            <a href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/images`} className="cta">
                Browse silhouettes
            </a>
        </section>
    )
}
export default Farewell
