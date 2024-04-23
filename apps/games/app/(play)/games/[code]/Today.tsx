import Link from "next/link"
import { Suspense } from "react"
import { formatDate, fromDate, toISOString, toPath } from "~/lib/datetime"
import { Attribution } from "./Attribution"
import { AttributionFallback } from "./AttributionFallback"
import styles from "./page.module.scss"
export const Today = ({ code }: { code: string }) => {
    const today = fromDate(new Date())
    return (
        <>
            <Link href={`/games/${encodeURIComponent(code)}/dates${toPath(today)}`}>
                <button className={styles.cta}>Play</button>
            </Link>
            <h3>
                <time dateTime={toISOString(today)}>{formatDate(today, "long")}</time>
            </h3>
            <Suspense fallback={<AttributionFallback />}>
                <Attribution code={code} date={today} />
            </Suspense>
        </>
    )
}
