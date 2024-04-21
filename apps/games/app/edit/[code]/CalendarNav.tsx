"use client"
import { useParams, usePathname, useRouter } from "next/navigation"
import Calendar from "react-calendar"
import { Value, View } from "react-calendar/dist/cjs/shared/types"
import { fromDate, fromParams, toISOString, toPath } from "~/lib/datetime"
import styles from "./CalendarNav.module.scss"
export type Params = {
    code: string
    year?: string
    month?: string
    day?: string
}
export const CalendarNav = () => {
    const params = useParams<Params>()
    const path = usePathname()
    const router = useRouter()
    const value = fromParams(params)
    const handleChange = (value: Value) => {
        const date = Array.isArray(value) ? value[0] : value
        if (date) {
            const newPath = "/" + path.split("/").filter(Boolean).slice(0, 2).join("/") + toPath(fromDate(date))
            router.push(newPath)
        }
    }
    const tileClass = (args: { activeStartDate: Date; date: Date; view: View }) => {
        if (args.view === "month") {
            if (value && args.date.toISOString().startsWith(toISOString(value))) {
                return [styles.tile, styles.tileCurrent]
            }
            const month = args.activeStartDate.getMonth() + (args.activeStartDate.getDate() === 1 ? 0 : 1)
            if (args.date.getMonth() !== month) {
                return [styles.tile, styles.tileOtherMonth]
            }
        }
        return styles.tile
    }
    return (
        <nav>
            <Calendar
                calendarType="gregory"
                className={styles.calendar}
                onChange={value => handleChange(value)}
                selectRange={false}
                tileClassName={tileClass}
                value={value ? toISOString(value) : undefined}
            />
        </nav>
    )
}
