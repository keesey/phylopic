import clsx from "clsx"
import { FC, useEffect, useState } from "react"
import AnchorLink from "~/ui/AnchorLink"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
const DonationPromo: FC = () => {
    const [variant, setVariant] = useState("variantA")
    useEffect(() => {
        const index = Math.floor(Math.random() * 3)
        setVariant(["variantA", "variantB", "variantC"][index])
    }, [])
    return (
        <aside className={clsx([styles.main, styles[variant]])}>
            <p>
                Hey, do you like <SiteTitle />? <AnchorLink href="/donate">Make a donation</AnchorLink> to keep it
                going!
            </p>
            <p>
                Or, <a href="https://www.patreon.com/tmkeesey?fan_landing=true">become a patron</a> to see previews of
                new features!
            </p>
        </aside>
    )
}
export default DonationPromo
