import { AnchorLink } from "@phylopic/ui"
import Image from "next/future/image"
import { FC } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import styles from "./index.module.scss"
const SiteNav: FC = () => {
    const authorized = useAuthorized()
    const email = useEmailAddress()
    return (
        <nav className={styles.main}>
            <h1>
                <a key="title" href="https://www.phylopic.org/">
                    <Image src="/logos/phylopic.svg" alt="PhyloPic" width={156.5} height={25.4} />
                </a>
                : Contribute
            </h1>
            {authorized && email && (
                <>
                    <AnchorLink href="/images/new">Contribute a New Image</AnchorLink>
                    <a href={`https://www.phylopic.org/contributors/${encodeURIComponent(email)}`}>View Your Images</a>
                    <AnchorLink href="/logout">Log Out</AnchorLink>
                </>
            )}
        </nav>
    )
}
export default SiteNav
