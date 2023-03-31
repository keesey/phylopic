import Link from "next/link"
import { FC } from "react"
import customEvents from "~/analytics/customEvents"
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
                            <a
                                href={process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/"}
                                onClick={() =>
                                    customEvents.clickLink(
                                        "contribution_cta_link",
                                        process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/",
                                        "Image Uplaoder",
                                        "link",
                                    )
                                }
                            >
                                Image Uploader
                            </a>
                        </li>
                    </ul>
                </section>
                <section>
                    <h3>Engineering</h3>
                    <p>
                        Software engineers may access the data in <SiteTitle /> using the API. They may also add
                        features to the <SiteTitle /> website.
                    </p>
                    <ul className={styles.ctaList}>
                        <li>
                            <a
                                href="http://api-docs.phylopic.org/v2"
                                onClick={() =>
                                    customEvents.clickLink(
                                        "contribution_cta_link",
                                        "http://api-docs.phylopic.org/v2",
                                        "API Documentation",
                                        "link",
                                    )
                                }
                                rel="help"
                            >
                                API Documentation
                            </a>
                        </li>
                        <li>
                            <a
                                href="//github.com/keesey/phylopic"
                                onClick={() =>
                                    customEvents.clickLink(
                                        "//github.com/keesey/phylopic",
                                        "http://api-docs.phylopic.org/v2",
                                        "Codebase",
                                        "link",
                                    )
                                }
                            >
                                Codebase
                            </a>
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
                            <a
                                href="//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW"
                                onClick={() =>
                                    customEvents.clickLink(
                                        "//github.com/keesey/phylopic",
                                        "//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW",
                                        "Make a donation",
                                        "link",
                                    )
                                }
                            >
                                Make a donation
                            </a>
                        </li>
                        <li>
                            <a
                                href="//www.patreon.com/tmkeesey?fan_landing=true"
                                onClick={() =>
                                    customEvents.clickLink(
                                        "//github.com/keesey/phylopic",
                                        "//www.patreon.com/tmkeesey?fan_landing=true",
                                        "Support the creator on Patreon",
                                        "link",
                                    )
                                }
                                rel="author"
                            >
                                Support the creator on Patreon
                            </a>
                        </li>
                        <li>
                            <a
                                href="//www.buymeacoffee.com/phylopic"
                                onClick={() =>
                                    customEvents.clickLink(
                                        "menu_link",
                                        "//www.buymeacoffee.com/phylopic",
                                        "Buy me a coffee",
                                        "link",
                                    )
                                }
                            >
                                Buy me a coffee
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        </section>
    )
}
export default ContributionCTAView
