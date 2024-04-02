import { ISOTimestamp } from "@phylopic/utils"
import React from "react"
export interface TimestampViewProps {
    format?: "date" | "datetime" | "year"
    value: ISOTimestamp
}
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export const TimestampView: React.FC<TimestampViewProps> = ({ format = "date", value }) => {
    const date = React.useMemo(() => (value ? new Date(value) : null), [value])
    const title = React.useMemo(() => date?.toLocaleString("en-US", { timeZone: "UTC" }), [date])
    const isYear = format === "year"
    const dateString = React.useMemo(() => {
        if (date) {
            const year = date?.getUTCFullYear().toString(10)
            if (isYear) {
                return year
            }
            const month = MONTH_NAMES[date.getUTCMonth()]
            const day = date.getUTCDate().toString(10)
            return `${year} ${month} ${day}`
        }
    }, [date, isYear])
    const timeString = React.useMemo(() => date?.toLocaleTimeString("en-US", { timeZone: "UTC" }), [date])
    if (!date || isNaN(date.valueOf())) {
        return null
    }
    return (
        <time dateTime={value} title={title}>
            {dateString}
            {format === "datetime" ? (
                <>
                    {" "}
                    {timeString}{" "}
                    <a
                        href="https://www.timeanddate.com/time/aboututc.html"
                        rel="noreferrer"
                        title="Coordinated Universal Time"
                    >
                        UTC
                    </a>
                </>
            ) : null}
        </time>
    )
}
