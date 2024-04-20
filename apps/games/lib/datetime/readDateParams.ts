import { redirect } from "next/navigation"
import { CalendarDateParams } from "./CalendarDateParams"
import { fromParams } from "./fromParams"
import { normalizeDate } from "./normalizeDate"
import { toPath } from "./toPath"
export const readDateParams = (params: CalendarDateParams, path: string) => {
    const raw = fromParams(params)
    if (!raw) {
        redirect(`${process.env.NEXT_PUBLIC_GAMES_URL}${path}`)
    }
    const normalized = normalizeDate(raw)
    const normalizedPath = toPath(normalized)
    const paramsPath = `/${params.year}/${params.month}/${params.day}`
    if (paramsPath !== normalizedPath) {
        redirect(`${process.env.NEXT_PUBLIC_GAMES_URL}${path}${normalizedPath}`)
    }
    return normalized
}
