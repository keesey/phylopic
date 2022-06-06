import { ISOTimestamp } from "@phylopic/utils"
import { FC, useMemo } from "react"
export interface Props {
    format?: "date" | "datetime" | "year"
    value: ISOTimestamp
}
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const TimestampView: FC<Props> = ({ format = "date", value }) => {
    const date = useMemo(() => (value ? new Date(value) : null), [value])
    const title = useMemo(() => date?.toLocaleString("en"), [date])
    const isYear = format === "year"
    const dateString = useMemo(() => {
        if (date) {
            const year = date?.getFullYear().toString(10)
            if (isYear) {
                return year
            }
            const month = MONTH_NAMES[date.getMonth()]
            const day = date.getDate().toString(10)
            return `${year} ${month} ${day}`
        }
    }, [date, isYear])
    const timeString = useMemo(() => date?.toLocaleTimeString(), [date])
    if (!date || isNaN(date.valueOf())) {
        return null
    }
    return (
        <time dateTime={value} title={title}>
            {dateString}
            {format === "datetime" ? ` ${timeString}` : null}
        </time>
    )
}
export default TimestampView
