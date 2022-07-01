import { AnchorLink, Loader } from "@phylopic/ui"
import { FC, useContext, useEffect } from "react"
import AuthContext from "~/auth/AuthContext"
import useAuthorized from "~/auth/hooks/useAuthorized"
const Farewell: FC = () => {
    const [, setJWT] = useContext(AuthContext) ?? []
    const authorized = useAuthorized()
    useEffect(() => {
        if (authorized) {
            setJWT?.(null)
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
