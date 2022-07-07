/* eslint-disable @next/next/no-img-element */
import { Contributor } from "@phylopic/api-models"
import { PaginationContainer } from "@phylopic/ui"
import Image from "next/future/image"
import { FC, ReactNode } from "react"
import AnchorLink from "~/ui/AnchorLink"
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
                <a href="https://www.systbio.org" className={styles.imageLink}>
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
                    href="https://www.patreon.com/tmkeesey?fan_landing=true"
                    title="Support the creator of PhyloPic on Patreon."
                >
                    <Image src={logoPatreon} width={150} height={20} alt="Patreon" />
                </a>
            </p>
            <section id="indiegogo">
                <h3>
                    Backers of the{" "}
                    <a
                        href="https://www.indiegogo.com/projects/phylopic-2-0-free-silhouettes-of-all-life-forms"
                        className={styles.imageLink}
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
                    <AnchorLink href="/contributors">All contributors of silhouettes</AnchorLink>
                </h3>
                {showContributors && (
                    <PaginationContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/contributors"}>
                        {items => (
                            <ul className={styles.list}>
                                {(items as readonly Contributor[]).map(item => (
                                    <li key={item.uuid}>
                                        <AnchorLink href={`/contributors/${encodeURIComponent(item.uuid)}`}>
                                            {item.name || "Anonymous"}
                                        </AnchorLink>
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
