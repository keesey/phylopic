import clsx from "clsx"
import { FC, useEffect, useState } from "react"
import customEvents from "~/analytics/customEvents"
import PAYPAL_DONATE_URL from "~/donate/PAYPAL_DONATE_URL"
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
                    href={PAYPAL_DONATE_URL}
                    onClick={() =>
                        customEvents.clickDonatePromoLink(
                            "make_donation",
                            PAYPAL_DONATE_URL,
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
