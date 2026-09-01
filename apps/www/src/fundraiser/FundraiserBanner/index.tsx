import type { FundraiserStatus } from "@phylopic/fundraiser"
import { FC } from "react"
import useSWR from "swr"
import customEvents from "~/analytics/customEvents"
import PAYPAL_DONATE_URL from "~/donate/PAYPAL_DONATE_URL"
import styles from "./index.module.scss"
import SiteTitle from "~/ui/SiteTitle"

const fetcher = async (url: string): Promise<FundraiserStatus> => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Could not load fundraiser status.")
    }
    return response.json() as Promise<FundraiserStatus>
}

const formatDollars = (cents: number): string =>
    (cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0, style: "currency", currency: "USD" })

const FundraiserBanner: FC = () => {
    const preview = process.env.NEXT_PUBLIC_FUNDRAISER_PREVIEW === "true"
    const { data, error } = useSWR("/api/fundraiser", fetcher, { refreshInterval: 30_000 })
    const showBanner = preview || data?.active
    if (!showBanner) {
        return null
    }
    const goalCents = data?.goalCents ?? 0
    const raisedCents = data?.raisedCents ?? 0
    const hasAmounts = !error && goalCents > 0
    return (
        <aside className={styles.main} role="region" aria-label="Hosting fundraiser">
            <p className={styles.content}>
                <span>
                    Help keep <SiteTitle /> online!
                </span>{" "}
                <progress className={styles.progress} max={goalCents} value={raisedCents} />
                <span className={styles.amounts}>
                    {formatDollars(raisedCents)} of {formatDollars(goalCents)}
                </span>{" "}
                <a
                    className={styles.link}
                    href={PAYPAL_DONATE_URL}
                    onClick={() => customEvents.clickLink("fundraiser_donate", PAYPAL_DONATE_URL, "Donate now", "link")}
                >
                    Donate now
                </a>
            </p>
        </aside>
    )
}

export default FundraiserBanner
