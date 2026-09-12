import { notFound } from "next/navigation"
import { NextResponse } from "next/server"
import { GAMES } from "~/games/GAMES"
import { fromDate, toPath } from "~/lib/datetime"
export async function GET(_req: Request, { params: paramsPromise }: { params: Promise<{ code: string }> }) {
    const params = await paramsPromise
    if (!GAMES[params.code]) {
        notFound()
    }
    return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_GAMES_URL}/games/${encodeURIComponent(params.code)}/dates${toPath(fromDate(new Date()))}`,
        { status: 307 },
    )
}
