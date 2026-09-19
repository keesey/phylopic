import { notFound } from "next/navigation"
import { NextResponse } from "next/server"
import { GAMES } from "~/games/GAMES"
export async function GET(
    _req: Request,
    { params: paramsPromise }: { params: Promise<{ code: string; year: string }> },
) {
    const params = await paramsPromise
    if (!GAMES[params.code]) {
        notFound()
    }
    return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_GAMES_URL}/games/${encodeURIComponent(params.code)}/dates/${encodeURIComponent(params.year)}/01/01`,
        { status: 308 },
    )
}
