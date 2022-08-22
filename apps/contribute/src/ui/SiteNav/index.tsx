import { AnchorLink } from "@phylopic/ui"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, ReactNode, useCallback, useEffect, useState } from "react"
import SiteTitle from "../SiteTitle"
import styles from "./index.module.scss"
const DropdownNav = dynamic(() => import("./DropdownNav"), { ssr: false })
export type Props = {
    children?: ReactNode
}
const SiteNav: FC<Props> = ({ children }) => {
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
            <div key="title" className={styles.breadcrumbs}>
                <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/`}>
                    <SiteTitle />
                </AnchorLink>
                <AnchorLink href="/">Contribute</AnchorLink>
                {children}
            </div>
            <div key="menuButton" className={styles.menuButton}>
                <button onClick={handleMenuButtonClick}>☰</button>
            </div>
            {dropdownOpen && <DropdownNav key="dropdownNav" onClose={handleDropdownNavClose} />}
        </nav>
    )
}
export default SiteNav
