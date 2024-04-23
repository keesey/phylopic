import { Loader, LoaderContext } from "@phylopic/client-components"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import styles from "./index.module.scss"
const PageLoader: FC = () => {
    const [active, setActive] = useState(false)
    const { events } = useRouter()
    useEffect(() => {
        const activate = () => setActive(true)
        const deactivate = () => setActive(false)
        events.on("routeChangeComplete", deactivate)
        events.on("routeChangeError", deactivate)
        events.on("routeChangeStart", activate)
        return () => {
            events.off("routeChangeComplete", deactivate)
            events.off("routeChangeError", deactivate)
            events.off("routeChangeStart", activate)
        }
    }, [events])
    if (!active) {
        return null
    }
    return (
        <div className={styles.main}>
            <LoaderContext.Provider value={{ color: "#fade85" }}>
                <Loader />
            </LoaderContext.Provider>
        </div>
    )
}
export default PageLoader
