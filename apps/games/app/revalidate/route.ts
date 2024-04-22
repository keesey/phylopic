import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
export async function GET() {
    // :TODO: token validation
    revalidateTag("games")
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_GAMES_URL}`)
}
