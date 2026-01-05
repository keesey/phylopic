import Link from "next/link"
import { FC } from "react"
import customEvents from "~/analytics/customEvents"
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
            <Link href="/" onClick={() => customEvents.clickLink("menu_link", "/", "PhyloPic", "link")}>
                <SiteTitle />
            </Link>{" "}
            &mdash; free silhouette images of organisms
            <div className={styles.subheader}>version 2.0</div>
        </div>
        <section>
            <h2>Browse</h2>
            <ul>
                <li>
                    <Link
                        href="/images"
                        onClick={() => customEvents.clickLink("menu_link", "/images", "Image Gallery", "link")}
                    >
                        Image Gallery
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/nodes/${encodeURIComponent(
                            process.env.NEXT_PUBLIC_ROOT_UUID ?? "",
                        )}/pan-biota-silhouettes`}
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                `/nodes/${encodeURIComponent(
                                    process.env.NEXT_PUBLIC_ROOT_UUID ?? "",
                                )}/pan-biota-silhouettes`,
                                "All Life",
                                "link",
                            )
                        }
                    >
                        All Life
                    </Link>
                </li>
                <li>
                    <Link
                        href="/contributors"
                        onClick={() => customEvents.clickLink("menu_link", "/contributors", "Contributors", "link")}
                    >
                        Contributors
                    </Link>
                </li>
            </ul>
        </section>
        <section>
            <h2>Usage</h2>
            <Link
                href="/articles/image-usage"
                onClick={() =>
                    customEvents.clickLink("menu_link", "/articles/image-usage", "How to Use Images", "link")
                }
            >
                How to Use Images
            </Link>
        </section>
        <section>
            <h2>Contribute</h2>
            <ul>
                <li>
                    <a
                        href={process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/"}
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/",
                                "Upload Images",
                                "link",
                            )
                        }
                    >
                        Upload Images
                    </a>
                </li>
                <li>
                    <a
                        href="//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW"
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                "//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW",
                                "Make a Donation",
                                "link",
                            )
                        }
                    >
                        Make a Donation
                    </a>
                </li>
                <li>
                    <a
                        href="//www.patreon.com/tmkeesey?fan_landing=true"
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                "//www.patreon.com/tmkeesey?fan_landing=true",
                                "Become a Patron",
                                "link",
                            )
                        }
                        rel="author"
                    >
                        Become a Patron
                    </a>
                </li>
                <li>
                    <a
                        href="//www.buymeacoffee.com/phylopic"
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                "//www.buymeacoffee.com/phylopic",
                                "Buy Me a Coffee",
                                "link",
                            )
                        }
                    >
                        Buy Me a Coffee
                    </a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Educational Materials</h2>
            <ul>
                <li>
                    <a
                        href="//www.patreon.com/tmkeesey/shop/pocket-phylogenies-print-out-1429988?source=phylopic"
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                "//www.patreon.com/tmkeesey/shop/pocket-phylogenies-print-out-1429988?source=phylopic",
                                "Pocket Phylogenies",
                                "link",
                            )
                        }
                    >
                        Pocket Phylogenies
                    </a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Follow</h2>
            <ul>
                <li>
                    <a
                        href="//www.patreon.com/tmkeesey?fan_landing=true"
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                "//www.patreon.com/tmkeesey?fan_landing=true",
                                "Patreon",
                                "link",
                            )
                        }
                        rel="author"
                    >
                        Patreon
                    </a>
                </li>
                <li>
                    <Link
                        href="/mailinglist"
                        onClick={() => customEvents.clickLink("menu_link", "/mailinglist", "Mailing List", "link")}
                    >
                        Mailing List
                    </Link>
                </li>
                <li>
                    <a
                        href="//sauropods.win/@phylopic"
                        onClick={() =>
                            customEvents.clickLink("menu_link", "//sauropods.win/@phylopic", "Mastodon", "link")
                        }
                        rel="me"
                    >
                        Mastodon
                    </a>
                </li>
                <li>
                    <a
                        href="//discord.gg/RtrWAzTEce"
                        onClick={() =>
                            customEvents.clickLink("menu_link", "//discord.gg/RtrWAzTEce", "Discord", "link")
                        }
                        rel="me"
                    >
                        Discord
                    </a>
                </li>
            </ul>
        </section>
        <section>
            <h2>Technical</h2>
            <ul>
                <li>
                    <a
                        href="//github.com/keesey/phylopic/issues/new"
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                "//github.com/keesey/phylopic/issues/new",
                                "Report an Issue",
                                "link",
                            )
                        }
                    >
                        Report an Issue
                    </a>
                </li>
                <li>
                    <Link
                        href="/articles/api-recipes"
                        onClick={() =>
                            customEvents.clickLink("menu_link", "/articles/api-recipes", "API Recipes", "link")
                        }
                    >
                        API Recipes
                    </Link>
                </li>
                <li>
                    <a
                        href="http://api-docs.phylopic.org/v2"
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                "http://api-docs.phylopic.org/v2",
                                "API Documentation",
                                "link",
                            )
                        }
                    >
                        API Documentation
                    </a>
                </li>
                <li>
                    <a
                        href="//github.com/keesey/phylopic"
                        onClick={() =>
                            customEvents.clickLink(
                                "menu_link",
                                "//github.com/keesey/phylopic",
                                "Code Repository",
                                "link",
                            )
                        }
                    >
                        Code Repository
                    </a>
                </li>
            </ul>
        </section>
        <section>
            <ul>
                <li>
                    <Link
                        href={`/contributors/${encodeURIComponent(
                            process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID ?? "",
                        )}/t-michael-keesey-silhouettes`}
                        onClick={() =>
                            customEvents.clickContributorLink("menu_link", {
                                _links: {
                                    self: {
                                        href: `/contributors/${encodeURIComponent(
                                            process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID ?? "",
                                        )}`,
                                        title: "T. Michael Keesey",
                                    },
                                },
                            })
                        }
                        rel="author"
                    >
                        Contact the Creator
                    </Link>
                </li>
                <li>
                    <Link
                        href="/thanks"
                        onClick={() => customEvents.clickLink("menu_link", "/thanks", "Special Thanks", "link")}
                    >
                        Special Thanks
                    </Link>
                </li>
            </ul>
        </section>
    </nav>
)
export default DropdownNav
