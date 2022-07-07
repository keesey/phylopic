import { AnchorLink, Loader } from "@phylopic/ui"
import { FC, useContext, useEffect } from "react"
import AuthContext from "~/auth/AuthContext"
const Farewell: FC = () => {
    const [authToken, setAuthToken] = useContext(AuthContext) ?? []
    useEffect(() => {
        setAuthToken?.(null)
        localStorage.clear()
    }, [setAuthToken])
    if (authToken) {
        return <Loader color="#ffffff" />
    }
    return (
        <section>
            <h2>You have logged out.</h2>
            <AnchorLink href="/" className="cta">
                Log Back In
            </AnchorLink>
        </section>
    )
}
export default Farewell
