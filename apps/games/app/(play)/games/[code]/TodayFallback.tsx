import { formatDate, fromDate, toISOString } from "~/lib/datetime"
import { AttributionFallback } from "./AttributionFallback"
import styles from "./page.module.scss"
export const TodayFallback = () => {
    const today = fromDate(new Date())
    return (
        <>
            <button disabled className={styles.cta}>
                Play
            </button>
            <h3>
                <time dateTime={toISOString(today)}>{formatDate(today, "long")}</time>
            </h3>
            <AttributionFallback />
        </>
    )
}
