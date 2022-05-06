import { FC } from "react"
import SearchBar from "../../search/SearchBar"
import AnchorLink from "../AnchorLink"
import SiteTitle from "../SiteTitle"
import styles from "./index.module.scss"
const SiteNav: FC = () => (
    <nav className={styles.main}>
        <AnchorLink key="title" className={styles.siteTitle} href="/">
            <SiteTitle />
        </AnchorLink>
        <SearchBar key="search" />
        <div key="menuButton" className={styles.menuButton}>
            <button>☰</button>
        </div>
    </nav>
)
export default SiteNav
