import clsx from "clsx"
import { FC, useEffect, useState } from "react"
import customEvents from "~/analytics/customEvents"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
const DonationPromo: FC = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const [variant, setVariant] = useState("variantA")
    useEffect(() => {
        if (mounted) {
            const index = Math.floor(Math.random() * 3)
            setVariant(["variantA", "variantB", "variantC"][index])
        }
    }, [mounted])
    return (
        <aside className={clsx([styles.main, styles[variant]])}>
            <p>
                Hey, do you like <SiteTitle />?{" "}
                <a
                    href="//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW"
                    onClick={() =>
                        customEvents.clickDonatePromoLink(
                            "make_donation",
                            "//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW",
                            "Make a donation",
                            variant,
                        )
                    }
                >
                    Make a donation
                </a>{" "}
                to keep it going!
            </p>
            <p>
                Or,{" "}
                <a
                    href="//www.patreon.com/tmkeesey?fan_landing=true"
                    onClick={() =>
                        customEvents.clickDonatePromoLink(
                            "become_patron",
                            "//www.patreon.com/tmkeesey?fan_landing=true",
                            "become a patron",
                            variant,
                        )
                    }
                    rel="author"
                >
                    become a patron
                </a>{" "}
                to see previews of new features!
            </p>
        </aside>
    )
}
export default DonationPromo
