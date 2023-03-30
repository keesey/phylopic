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
            <div className={styles.subheader}>version 2.0</div>
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
                    <a href="//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW">Make a Donation</a>
                </li>
                <li>
                    <a href="//www.patreon.com/tmkeesey?fan_landing=true" rel="author">
                        Become a Patron
                    </a>
                </li>
                <li>
                    <a href="//www.buymeacoffee.com/phylopic">Buy Me a Coffee</a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Educational Materials</h2>
            <ul>
                <li>
                    <a href="//keesey.gumroad.com/l/pocketphylogenies">Pocket Phylogenies</a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Follow</h2>
            <ul>
                <li>
                    <a href="//www.patreon.com/tmkeesey?fan_landing=true" rel="author">
                        Patreon
                    </a>
                </li>
                <li>
                    <Link href="/mailinglist">Mailing List</Link>
                </li>
                <li>
                    <a href="//sauropods.win/@phylopic" rel="me">
                        Mastodon
                    </a>
                </li>
                <li>
                    <a href="//discord.gg/RtrWAzTEce" rel="me">
                        Discord
                    </a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Technical</h2>
            <ul>
                <li>
                    <a href="//github.com/keesey/phylopic/issues/new">Report an Issue</a>
                </li>
                <li>
                    <Link href="/api-recipes">API Recipes</Link>
                </li>
                <li>
                    <a href="http://api-docs.phylopic.org/v2">API Documentation</a>
                </li>
                <li>
                    <a href="//github.com/keesey/phylopic">Code Repository</a>
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
