import { FC } from "react"
import AnchorLink from "~/ui/AnchorLink"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
const DonationPromo: FC = () => {
    return (
        <aside className={styles.main}>
            <p>
                Hey, do you like <SiteTitle />? <AnchorLink href="/donate">Make a donation</AnchorLink> to keep it
                going!
            </p>
        </aside>
    )
}
export default DonationPromo
