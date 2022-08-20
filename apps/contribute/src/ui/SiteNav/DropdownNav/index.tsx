import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useImageCount from "~/editing/hooks/useImageCount"
import SiteTitle from "~/ui/SiteTitle"
import SpawnLink from "~/ui/SpawnLink"
import styles from "./index.module.scss"
export type Props = {
    onClose?: () => void
}
const DropdownNav: FC<Props> = ({ onClose }) => {
    const authorized = useAuthorized()
    const accepted = useImageCount("accepted")
    const incomplete = useImageCount("incomplete")
    const submitted = useImageCount("submitted")
    const withdrawn = useImageCount("withdrawn")
    return (
        <nav className={styles.main}>
            <div className={styles.menuButton}>
                <button onClick={onClose}>☰</button>
            </div>
            <div className={styles.siteLink}>
                <div className={styles.siteTitle}>
                    <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/`}>
                        <SiteTitle />
                    </AnchorLink>
                    {" / "}
                    <AnchorLink href="/">Contribute</AnchorLink>
                </div>
                <div className={styles.subheader}>
                    version 2.0 <abbr title="beta version">βɛτα</abbr>
                </div>
            </div>
            <section>
                <h2>Your Account</h2>
                <ul>
                    {!authorized && (
                        <li key="account:/">
                            <AnchorLink href="/">Log In</AnchorLink>
                        </li>
                    )}
                    {authorized && (
                        <li key="account:/">
                            <AnchorLink href="/">Overview</AnchorLink>
                        </li>
                    )}
                    {incomplete! > 0 && (
                        <li key="account:/incomplete">
                            <AnchorLink href="/images/incomplete">Your Submissions in Progress</AnchorLink>
                        </li>
                    )}
                    {submitted! > 0 && (
                        <li key="account:/submitted">
                            <AnchorLink href="/images/submitted">Your Pending Submissions</AnchorLink>
                        </li>
                    )}
                    {accepted! > 0 && (
                        <li key="account:/accepted">
                            <AnchorLink href="/images/accepted">Your Accepted Images</AnchorLink>
                        </li>
                    )}
                    {withdrawn! > 0 && (
                        <li key="account:/withdrawn">
                            <AnchorLink href="/images/withdrawn">Your Withdrawn Images</AnchorLink>
                        </li>
                    )}
                    {authorized && (
                        <li key="account:/spawn">
                            <SpawnLink>Upload a Silhouette</SpawnLink>
                        </li>
                    )}
                    {authorized && (
                        <li key="account:/logout">
                            <AnchorLink href="/logout">Log Out</AnchorLink>
                        </li>
                    )}
                </ul>
            </section>
            <section>
                <h2>Browse the Site</h2>
                <ul>
                    <li>
                        <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/images`}>
                            Image Gallery
                        </AnchorLink>
                    </li>
                    <li>
                        <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/root`}>All Life</AnchorLink>
                    </li>
                    <li>
                        <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/contributors`}>
                            Contributors
                        </AnchorLink>
                    </li>
                </ul>
            </section>
            <section>
                <h2>Contribute</h2>
                <ul>
                    {!authorized && (
                        <li key="contribute:/">
                            <AnchorLink href="/">Upload Images</AnchorLink>
                        </li>
                    )}
                    {authorized && (
                        <li key="contribute:/spawn">
                            <SpawnLink>Upload an Image</SpawnLink>
                        </li>
                    )}
                    <li key="contribute:/donate">
                        <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/donate`}>
                            Make a Donation
                        </AnchorLink>
                    </li>
                    <li key="contribute:patreon">
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
                        <a href="https://www.patreon.com/tmkeesey?fan_landing=true">Patreon</a>
                    </li>
                    <li>
                        <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/mailinglist`}>
                            Mailing List
                        </AnchorLink>
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
                        <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/contact`}>
                            Contact the Creator
                        </AnchorLink>
                    </li>
                    <li>
                        <AnchorLink href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/thanks`}>
                            Special Thanks
                        </AnchorLink>
                    </li>
                </ul>
            </section>
        </nav>
    )
}
export default DropdownNav
