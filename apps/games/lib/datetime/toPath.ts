import { CalendarDate } from "./CalendarDate"
const pad = (n: number, length: number) => {
    let s = Math.floor(n).toString().slice(0, length)
    while (s.length < length) {
        s = `0${s}`
    }
    return s
}
export const toPath = (date: CalendarDate) => `/${pad(date.year, 4)}/${pad(date.month, 2)}/${pad(date.day, 2)}`
