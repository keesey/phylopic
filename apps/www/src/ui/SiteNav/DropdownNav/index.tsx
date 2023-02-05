import Link from "next/link"
import { FC } from "react"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
export type Props = {
    onClose?: () => void
}
const DropdownNav: FC<Props> = ({ onClose }) => (
    <nav className={styles.main}>
        <div className={styles.menuButton}>
            <button onClick={onClose}>☰</button>
        </div>
        <div className={styles.siteLink}>
            <Link href="/">
                <SiteTitle />
            </Link>{" "}
            &mdash; free silhouette images of organisms
            <div className={styles.subheader}>
                version 2.0 <abbr title="beta version">βɛτα</abbr>
            </div>
        </div>
        <section>
            <h2>Browse</h2>
            <ul>
                <li>
                    <Link href="/images">Image Gallery</Link>
                </li>
                <li>
                    <Link href={`/nodes/${encodeURIComponent(process.env.NEXT_PUBLIC_ROOT_UUID!)}`}>All Life</Link>
                </li>
                <li>
                    <Link href="/contributors">Contributors</Link>
                </li>
            </ul>
        </section>
        <section>
            <h2>Contribute</h2>
            <ul>
                <li>
                    <a href={process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/"}>Upload Images</a>
                </li>
                <li>
                    <Link href="/donate">Make a Donation</Link>
                </li>
                <li>
                    <a href="https://www.patreon.com/tmkeesey?fan_landing=true">Become a Patron</a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Educational Materials</h2>
            <ul>
                <li>
                    <a href="https://keesey.gumroad.com/l/pocketphylogenies">Pocket Phylogenies</a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Follow</h2>
            <ul>
                <li>
                    <a href="https://www.patreon.com/tmkeesey?fan_landing=true" rel="author">
                        Patreon
                    </a>
                </li>
                <li>
                    <Link href="/mailinglist">Mailing List</Link>
                </li>
                <li>
                    <a href="https://sauropods.win/@phylopic" rel="me">
                        Mastodon
                    </a>
                </li>
                <li>
                    <a href="https://discord.gg/RtrWAzTEce">Discord</a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Technical</h2>
            <ul>
                <li>
                    <a href="https://github.com/keesey/phylopic/issues/new">Report an Issue</a>
                </li>
                <li>
                    <a href="http://api-docs.phylopic.org/2.0">API Documentation</a>
                </li>
                <li>
                    <a href="https://github.com/keesey/phylopic">Code Repository</a>
                </li>
            </ul>
        </section>
        <section>
            <ul>
                <li>
                    <Link
                        href={`/contributors/${encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID!)}`}
                        rel="author"
                    >
                        Contact the Creator
                    </Link>
                </li>
                <li>
                    <Link href="/thanks">Special Thanks</Link>
                </li>
            </ul>
        </section>
    </nav>
)
export default DropdownNav
