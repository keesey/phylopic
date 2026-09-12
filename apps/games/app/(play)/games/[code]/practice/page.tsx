import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { GAMES } from "~/games/GAMES"
import { GameGenerator } from "./GameGenerator"
export type Params = Readonly<{ code: string }>
export const generateMetadata = async ({ params: paramsPromise }: { params: Promise<Params> }): Promise<Metadata> => {
    const params = await paramsPromise
    return {
        authors: [
            {
                name: GAMES[params.code].author.name,
                url: GAMES[params.code].author.href,
            },
        ],
        title: `${GAMES[params.code].title}, practice game`,
        description: GAMES[params.code].summary,
    }
}
const GameDayPage = async ({ params: paramsPromise }: { params: Promise<Params> }) => {
    const params = await paramsPromise
    if (!GAMES[params.code]) {
        notFound()
    }
    return <GameGenerator code={params.code} />
}
export default GameDayPage
