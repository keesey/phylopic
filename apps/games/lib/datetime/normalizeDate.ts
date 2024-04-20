import { CalendarDate } from "./CalendarDate"
import { fromDate } from "./fromDate"
import { toDate } from "./toDate"
export const normalizeDate = (date: CalendarDate) => fromDate(toDate(date))
