import { CalendarDate } from "./CalendarDate"
import { pad } from "./pad"
export const toPath = (date: CalendarDate) => `/${pad(date.year, 4)}/${pad(date.month, 2)}/${pad(date.day, 2)}`
