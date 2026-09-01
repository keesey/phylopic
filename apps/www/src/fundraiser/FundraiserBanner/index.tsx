import type { CampaignId, FundraiserStatus } from "@phylopic/fundraiser"
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

const monthNameFromCampaign = (campaign: CampaignId | null | undefined): string | null => {
    if (!campaign) {
        return null
    }
    return campaign.endsWith("-05") ? "May" : "October"
}

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
    const exceeded = hasAmounts && raisedCents > goalCents
    const monthName = monthNameFromCampaign(data?.campaign)
    const onClick = () =>
        customEvents.clickLink(
            "fundraiser_donate",
            PAYPAL_DONATE_URL,
            exceeded ? "Click here to donate more!" : "Click here to help us reach the goal!",
            "link",
        )

    return (
        <a
            aria-label={exceeded ? "Donate to PhyloPic" : "Help PhyloPic reach its fundraising goal"}
            className={styles.main}
            href={PAYPAL_DONATE_URL}
            onClick={onClick}
        >
            {exceeded ? (
                <>
                    <p className={styles.title}>We did it!</p>
                    <p className={styles.message}>
                        Thanks to everyone who contributed, we raised {formatDollars(goalCents)} to cover <SiteTitle/>&rsquo;s
                        hosting costs.
                    </p>
                    <p className={styles.message}>
                        <span className={styles.cta}>Click here to donate more!</span>
                    </p>
                </>
            ) : (
                <>
                    <p className={styles.title}><SiteTitle/> {monthName} Fundraiser</p>
                    <div
                        aria-label="Fundraising progress"
                        aria-valuemax={goalCents}
                        aria-valuemin={0}
                        aria-valuenow={Math.min(raisedCents, goalCents)}
                        className={styles.progressTrack}
                        role="progressbar"
                    >
                        <div
                            className={styles.progressFill}
                            style={{ width: `${Math.min(100, (raisedCents / goalCents) * 100)}%` }}
                        />
                    </div>
                    <p className={styles.message}>
                        <>
                            We&rsquo;ve raised {formatDollars(raisedCents)} of {formatDollars(goalCents)} to cover
                            hosting costs for the past six months. <span className={styles.cta}>Click here to help us reach the goal!</span>
                        </>
                    </p>
                </>
            )}
        </a>
    )
}

export default FundraiserBanner
