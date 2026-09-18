import { ISOTimestamp } from "@phylopic/utils"
import React from "react"
export interface TimestampViewProps {
    format?: "date" | "datetime" | "year"
    value: ISOTimestamp
}
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const getDateString = (date: Date | null, isYear: boolean) => {
    if (date) {
        const year = date?.getUTCFullYear().toString(10)
        if (isYear) {
            return year
        }
        const month = MONTH_NAMES[date.getUTCMonth()]
        const day = date.getUTCDate().toString(10)
        return `${year} ${month} ${day}`
    }
}
export const TimestampView: React.FC<TimestampViewProps> = ({ format = "date", value }) => {
    const date = value ? new Date(value) : null
    const title = date?.toLocaleString("en-US", { timeZone: "UTC" })
    const isYear = format === "year"
    const dateString = getDateString(date, isYear)
    const timeString = date?.toLocaleTimeString("en-US", { timeZone: "UTC" })
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
