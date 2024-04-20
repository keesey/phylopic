import { CalendarDate } from "./CalendarDate"
import { CalendarDateParams } from "./CalendarDateParams"
const isInteger = (n: unknown): n is number => typeof n === "number" && isFinite(n) && Math.floor(n) === n
export const fromParams = (params: CalendarDateParams): CalendarDate | null => {
    const year = parseInt(params.year, 10)
    const month = parseInt(params.month, 10)
    const day = parseInt(params.day, 10)
    if (!isInteger(year) || !isInteger(month) || !isInteger(day)) {
        return null
    }
    return { day, month, year }
}
