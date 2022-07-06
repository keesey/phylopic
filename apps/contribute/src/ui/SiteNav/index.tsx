import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import SiteTitle from "../SiteTitle"
import styles from "./index.module.scss"
const SiteNav: FC = () => {
    const authorized = useAuthorized()
    const email = useEmailAddress()
    return (
        <nav className={styles.main}>
            <h1>
                <a key="title" href="https://beta.phylopic.org/">
                    <SiteTitle />
                </a>
            </h1>
            {authorized && email && (
                <>
                    <AnchorLink href="/submissions/new">Contribute a New Image</AnchorLink>
                    <AnchorLink href="/submissions">View Your Images</AnchorLink>
                    <AnchorLink href="/logout">Log Out</AnchorLink>
                </>
            )}
        </nav>
    )
}
export default SiteNav
