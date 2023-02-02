import clsx from "clsx"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
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
                Hey, do you like <SiteTitle />? <Link href="/donate">Make a donation</Link> to keep it going!
            </p>
            <p>
                Or, <a href="https://www.patreon.com/tmkeesey?fan_landing=true">become a patron</a> to see previews of
                new features!
            </p>
        </aside>
    )
}
export default DonationPromo
