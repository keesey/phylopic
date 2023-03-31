import { Contributor } from "@phylopic/api-models"
import { PaginationContainer } from "@phylopic/ui"
import Image from "next/image"
import Link from "next/link"
import { FC, ReactNode } from "react"
import customEvents from "~/analytics/customEvents"
import logoIndiegogo from "../../../public/logos/indiegogo-cerulean.svg"
import logoPatreon from "../../../public/logos/patreon-cerulean.svg"
import logoSSB from "../../../public/logos/ssb-cerulean.svg"
import styles from "./index.module.scss"
export interface Props {
    showContributors?: boolean
    supporters?: readonly ReactNode[]
}
const SupportersView: FC<Props> = ({ supporters, showContributors }) => {
    return (
        <div className={styles.main}>
            <p className={styles.highlighted} id="systbio.org">
                <a
                    href="//www.systbio.org"
                    className={styles.imageLink}
                    onClick={() =>
                        customEvents.clickLink(
                            "supporters_external",
                            "//www.systbio.org",
                            "The Society of Systematic Biologists",
                            "link",
                        )
                    }
                    rel="external"
                >
                    <cite>
                        <Image
                            src={logoSSB}
                            height={26}
                            alt="The Society of Systematic Biologists"
                            className={styles.imageTextWithTail}
                            width={473}
                            style={{ objectFit: "contain" }}
                        />
                    </cite>
                </a>
            </p>
            <p className={styles.highlighted} id="patreon">
                All patrons on{" "}
                <a
                    className={styles.imageLink}
                    href="//www.patreon.com/tmkeesey?fan_landing=true"
                    onClick={() =>
                        customEvents.clickLink(
                            "supporters_external",
                            "//www.patreon.com/tmkeesey?fan_landing=true",
                            "Patreon",
                            "link",
                        )
                    }
                    rel="author"
                    title="Support the creator of PhyloPic on Patreon."
                >
                    <Image src={logoPatreon} width={150} height={20} alt="Patreon" />
                </a>
            </p>
            <section id="indiegogo">
                <h3>
                    Backers of the{" "}
                    <a
                        className={styles.imageLink}
                        href="//www.indiegogo.com/projects/phylopic-2-0-free-silhouettes-of-all-life-forms"
                        onClick={() =>
                            customEvents.clickLink(
                                "supporters_external",
                                "//www.indiegogo.com/projects/phylopic-2-0-free-silhouettes-of-all-life-forms",
                                "IndieGogo",
                                "link",
                            )
                        }
                    >
                        <Image src={logoIndiegogo} width={140} height={20} alt="IndieGogo" />
                        campaign
                    </a>
                    {supporters && ":"}
                </h3>
                {supporters && (
                    <ul className={styles.list}>
                        {supporters.map((name, index) => (
                            <li key={index}>{name}</li>
                        ))}
                    </ul>
                )}
            </section>
            <section id="contributors">
                <h3>
                    <Link
                        href="/contributors"
                        onClick={() =>
                            customEvents.clickLink(
                                "supporters_contributors",
                                "/contributors",
                                "All contributors of silhouettes",
                                "link",
                            )
                        }
                    >
                        All contributors of silhouettes
                    </Link>
                </h3>
                {showContributors && (
                    <PaginationContainer
                        endpoint={process.env.NEXT_PUBLIC_API_URL + "/contributors"}
                        onPage={customEvents.loadContributorListPage}
                    >
                        {items => (
                            <ul className={styles.list}>
                                {(items as readonly Contributor[]).map(item => (
                                    <li key={item.uuid}>
                                        <Link href={`/contributors/${encodeURIComponent(item.uuid)}`}>
                                            {item.name || "Anonymous"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </PaginationContainer>
                )}
            </section>
        </div>
    )
}
export default SupportersView
