"use client"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, Suspense, useCallback, useEffect, useState } from "react"
import customEvents from "~/analytics/customEvents"
import SearchBar from "../SearchBar"
import SiteTitle from "../SiteTitle"
import styles from "./index.module.scss"
const DropdownNav = dynamic(() => import("./DropdownNav"), { ssr: false })
const SiteNav: FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const router = useRouter()
    useEffect(() => {
        const handler = () => setDropdownOpen(false)
        router.events.on("routeChangeStart", handler)
        return () => router.events.off("routeChangeStart", handler)
    }, [router])
    return (
        <nav className={styles.main}>
            <Link
                key="title"
                className={styles.siteTitle}
                href="/"
                onClick={() => customEvents.clickLink("nav_home", "/", "PhyloPic", "link")}
            >
                <h1>
                    <SiteTitle />
                </h1>
            </Link>
            <SearchBar key="search" />
            <div key="menuButton" className={styles.menuButton}>
                <button
                    onClick={() => {
                        customEvents.toggleSiteMenu(!dropdownOpen)
                        setDropdownOpen(!dropdownOpen)
                    }}
                >
                    ☰
                </button>
            </div>
            {dropdownOpen && (
                <Suspense>
                    {" "}
                    <DropdownNav
                        onClose={() => {
                            customEvents.toggleSiteMenu(false)
                            setDropdownOpen(false)
                        }}
                    />
                </Suspense>
            )}
        </nav>
    )
}
export default SiteNav
