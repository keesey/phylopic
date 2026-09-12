import { CalendarDate } from "./CalendarDate"
export const fromDate = (date: Date): CalendarDate => ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
})
