import { NextResponse } from "next/server"
export async function GET(_req: Request) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_GAMES_URL}`)
}
