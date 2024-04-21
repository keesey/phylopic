import { notFound } from "next/navigation"
import { NextResponse } from "next/server"
import { GAMES } from "~/games/GAMES"
export async function GET(_req: Request, { params }: { params: { code: string; year: string; month: string } }) {
    if (!GAMES[params.code]) {
        notFound()
    }
    return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_GAMES_URL}/edit/${encodeURIComponent(params.code)}/${encodeURIComponent(params.year)}/${encodeURIComponent(params.month)}/01`,
        { status: 308 },
    )
}
