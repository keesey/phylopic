import { AnchorLink } from "@phylopic/ui"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FC, ReactNode, useCallback, useEffect, useState } from "react"
import SearchBar from "../SearchBar"
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
            <AnchorLink key="title" className={styles.siteTitle} href="/">
                <SiteTitle />
            </AnchorLink>
            <SearchBar key="search" />
            <div key="menuButton" className={styles.menuButton}>
                <button onClick={handleMenuButtonClick}>☰</button>
            </div>
            {dropdownOpen && <DropdownNav onClose={handleDropdownNavClose} />}
        </nav>
    )
}
export default SiteNav
