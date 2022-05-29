import { FC } from "react"
import AnchorLink from "~/ui/AnchorLink"
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
            <AnchorLink href="/">
                <SiteTitle />
            </AnchorLink>{" "}
            &mdash; free silhouette images of organisms
            <div className={styles.subheader}>
                version 2.0 <abbr title="beta version">βɛτα</abbr>
            </div>
        </div>
        <section>
            <h2>Browse</h2>
            <ul>
                <li>
                    <AnchorLink href="/images">Image Gallery</AnchorLink>
                </li>
                <li>
                    <AnchorLink href={`/nodes/${process.env.NEXT_PUBLIC_ROOT_UUID}`}>All Life</AnchorLink>
                </li>
                <li>
                    <AnchorLink href="/contributors">Contributors</AnchorLink>
                </li>
            </ul>
        </section>
        <section>
            <h2>Contribute</h2>
            <ul>
                <li>
                    <a href="https://contribute.phylopic.org">Upload Images</a>
                </li>
                <li>
                    <AnchorLink href="/donate">Make a Donation</AnchorLink>
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
                    <a href="https://api-docs.phylopic.org">API Documentation</a>
                </li>
                <li>
                    <a href="https://github.com/keesey/phylopic">Code Repository</a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Follow</h2>
            <ul>
                <li>
                    <a href="https://www.patreon.com/tmkeesey">Patreon</a>
                </li>
                <li>
                    <a href="https://www.twitter.com/phylopic">Twitter</a>
                </li>
                <li>
                    <a href="https://www.facebook.com/phylopic">Facebook</a>
                </li>
            </ul>
        </section>
        <section>
            <ul>
                <li>
                    <AnchorLink href={`/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}`}>
                        Contact the Creator
                    </AnchorLink>
                </li>
                <li>
                    <AnchorLink href="/thanks">Special Thanks</AnchorLink>
                </li>
            </ul>
        </section>
    </nav>
)
export default DropdownNav