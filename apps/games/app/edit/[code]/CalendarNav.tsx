"use client"
import { fetchJSON } from "@phylopic/utils-api"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import Calendar from "react-calendar"
import { OnArgs, TileArgs, Value } from "react-calendar/dist/cjs/shared/types"
import useSWR from "swr"
import { CalendarDate, fromDate, fromParams, toISOString, toPath } from "~/lib/datetime"
import { pad } from "~/lib/datetime/pad"
import styles from "./CalendarNav.module.scss"
export type Params = {
    code: string
    day?: string
    month?: string
    year?: string
}
export const CalendarNav = () => {
    const params = useParams<Params>()
    const path = usePathname()
    const router = useRouter()
    const date = fromParams(params)
    const [calendarMonth, setCalendarMonth] = useState<Omit<CalendarDate, "day"> | null>(() => date)
    const calendarKey = calendarMonth
        ? `/calendar/${encodeURIComponent(params.code)}/${encodeURIComponent(pad(calendarMonth.year, 4))}/${encodeURIComponent(pad(calendarMonth.month, 2))}`
        : null
    const { data: calendarData } = useSWR<{ days: number[] }>(calendarKey, fetchJSON)
    const handleActiveStartDateChange = (args: OnArgs) => {
        setCalendarMonth(
            args.view === "month" && args.activeStartDate
                ? { year: args.activeStartDate.getFullYear(), month: args.activeStartDate.getMonth() + 1 }
                : null,
        )
    }
    const handleChange = (value: Value) => {
        const date = Array.isArray(value) ? value[0] : value
        if (date) {
            const newPath = "/" + path.split("/").filter(Boolean).slice(0, 2).join("/") + toPath(fromDate(date))
            router.push(newPath)
        }
    }
    const tileClass = (args: TileArgs) => {
        if (args.view === "month") {
            if (date && args.date.toISOString().startsWith(toISOString(date))) {
                return [styles.tile, styles.tileCurrent]
            }
            const month = args.activeStartDate.getMonth() + (args.activeStartDate.getDate() === 1 ? 0 : 1)
            if (args.date.getMonth() !== month) {
                return [styles.tile, styles.tileOtherMonth]
            }
        }
        return styles.tile
    }
    const tileContent = (args: TileArgs) => {
        if (args.view === "month") {
            const month = args.activeStartDate.getMonth() + (args.activeStartDate.getDate() === 1 ? 0 : 1)
            return calendarMonth &&
                calendarData &&
                month + 1 === calendarMonth.month &&
                calendarData.days.includes(args.date.getDate()) ? (
                <span className={styles.populatedIndicator}>•</span>
            ) : undefined
        }
    }
    return (
        <nav>
            <Calendar
                calendarType="gregory"
                className={styles.calendar}
                onActiveStartDateChange={handleActiveStartDateChange}
                onChange={value => handleChange(value)}
                selectRange={false}
                tileClassName={tileClass}
                tileContent={tileContent}
                value={date ? toISOString(date) : undefined}
            />
        </nav>
    )
}
