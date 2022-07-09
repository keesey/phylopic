import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
export type Props = {
    onClose?: () => void
}
const DropdownNav: FC<Props> = ({ onClose }) => {
    const authorized = useAuthorized()
    return (
        <nav className={styles.main}>
            <div className={styles.menuButton}>
                <button onClick={onClose}>☰</button>
            </div>
            <div className={styles.siteLink}>
                <AnchorLink href="/">
                    <b>
                        <SiteTitle />: Contribute
                    </b>
                </AnchorLink>{" "}
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
                    {authorized && (
                        <li key="account:/images">
                            <AnchorLink href="/images">Your Images</AnchorLink>
                        </li>
                    )}
                    {authorized && (
                        <li key="account:/images/new">
                            <AnchorLink href="/images/new">Upload an Image</AnchorLink>
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
                        <li key="contribute:/images/new">
                            <AnchorLink href="/images/new">Upload an Image</AnchorLink>
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
