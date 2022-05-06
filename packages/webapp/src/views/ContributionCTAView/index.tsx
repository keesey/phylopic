import { FC } from "react"
import AnchorLink from "~/ui/AnchorLink"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
const ContributionCTAView: FC = () => {
    return (
        <section>
            <h2>Contribute</h2>
            <div className={styles.columns}>
                <section>
                    <h3>Silhouettes</h3>
                    <p>
                        Anyone may upload silhouettes to <SiteTitle />.
                    </p>
                    <ul className={styles.ctaList}>
                        <li>
                            <AnchorLink href="/contribute/images">Image Uploader</AnchorLink>
                        </li>
                    </ul>
                </section>
                <section>
                    <h3>Engineering</h3>
                    <p>
                        Application developers may access the data in <SiteTitle /> using the API. Developers may also
                        add features to the <SiteTitle /> website.
                    </p>
                    <ul className={styles.ctaList}>
                        <li>
                            <AnchorLink href="/apidocs">API Documentation</AnchorLink>
                        </li>
                        <li>
                            <AnchorLink href="/code">Codebases</AnchorLink>
                        </li>
                    </ul>
                </section>
                <section>
                    <h3>Donations</h3>
                    <p>
                        Keep <SiteTitle /> online by making a donation to the web service fund, or to one of the many
                        other projects <SiteTitle /> relies on.
                    </p>
                    <ul className={styles.ctaList}>
                        <li>
                            <AnchorLink href="/contribute">Make a donation</AnchorLink>
                        </li>
                        <li>
                            <a href="https://www.patreon.com/tmkeesey">Support the creator on Patreon</a>
                        </li>
                    </ul>
                </section>
            </div>
        </section>
    )
}
export default ContributionCTAView
