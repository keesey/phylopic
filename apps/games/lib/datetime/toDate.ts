import { CalendarDate } from "./CalendarDate"
export const toDate = (date: CalendarDate) => new Date(date.year, date.month - 1, date.day)
