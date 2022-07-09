import { AnchorLink } from "@phylopic/ui"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useState } from "react"
import SiteTitle from "../SiteTitle"
import styles from "./index.module.scss"
const DropdownNav = dynamic(() => import("./DropdownNav"), { ssr: false })
const SiteNav: FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const router = useRouter()
    const handleMenuButtonClick = useCallback(() => setDropdownOpen(!dropdownOpen), [dropdownOpen])
    const handleDropdownNavClose = useCallback(() => setDropdownOpen(false), [])
    useEffect(() => {
        const handler = () => setDropdownOpen(false)
        router.events.on("routeChangeStart", handler)
        return () => router.events.off("routeChangeStart", handler)
    }, [router])
    return (
        <nav className={styles.main}>
            <div key="title" className={styles.siteTitle}>
                <AnchorLink key="title" className={styles.siteTitle} href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/`}>
                    <SiteTitle />
                </AnchorLink>
                {" / "}
                <AnchorLink key="title" className={styles.siteTitle} href="/">
                    Contribute
                </AnchorLink>
            </div>
            <div key="menuButton" className={styles.menuButton}>
                <button onClick={handleMenuButtonClick}>☰</button>
            </div>
            {dropdownOpen && <DropdownNav onClose={handleDropdownNavClose} />}
        </nav>
    )
}
export default SiteNav
