import { RedirectType, redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { NextResponse } from "next/server"
import { GAMES } from "~/games/GAMES"
import { fromParams, toPath } from "~/lib/datetime"
import { CalendarDateParams } from "~/lib/datetime/CalendarDateParams"
import { normalizeDate } from "~/lib/datetime/normalizeDate"
import { pad } from "~/lib/datetime/pad"
import { getGameMonthList } from "~/lib/s3/getGameMonthList"
export const readDateParams = (params: Omit<CalendarDateParams, "day">, code: string) => {
    const raw = fromParams({ ...params, day: "01" })
    if (!raw) {
        notFound()
    }
    const normalized = normalizeDate(raw)
    const normalizedPath = `/${pad(normalized.year, 4)}/${pad(normalized.month, 2)}`
    const paramsPath = `/${encodeURIComponent(params.year)}/${encodeURIComponent(params.month)}`
    if (paramsPath !== normalizedPath) {
        redirect(
            `${process.env.NEXT_PUBLIC_GAMES_URL}/calendar/${encodeURIComponent(code)}${normalizedPath}`,
            RedirectType.replace,
        )
    }
    return normalized
}
export async function GET(_req: Request, { params }: { params: { code: string; year: string; month: string } }) {
    if (!GAMES[params.code]) {
        notFound()
    }
    const date = readDateParams(params, `/calendar/${encodeURIComponent(params.code)}`)
    const list = await getGameMonthList(params.code, date)
    const days = list?.map(content => parseInt(content.match(/\/(\d\d)\.json$/)![1], 10)) ?? []
    return NextResponse.json({ days })
}
