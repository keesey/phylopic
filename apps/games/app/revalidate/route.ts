import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { isAuthorizedRevalidation } from "~/lib/revalidate/isAuthorizedRevalidation"

export async function GET(request: Request) {
    if (!isAuthorizedRevalidation(request)) {
        return new NextResponse("Unauthorized", { status: 401 })
    }
    revalidateTag("games")
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_GAMES_URL}`)
}
