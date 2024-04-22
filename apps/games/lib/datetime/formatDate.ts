import { CalendarDate } from "./CalendarDate"
import { toDate } from "./toDate"
const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]
const DAY_OF_WEEK_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
export const formatDate = (date: CalendarDate, style?: "long" | "short") =>
    `${style === "long" ? `${DAY_OF_WEEK_NAMES[toDate(date).getDay()]} ` : ""}${date.day} ${style === "short" ? MONTH_NAMES[date.month - 1].slice(0, 3) : MONTH_NAMES[date.month - 1]}, ${date.year}`
