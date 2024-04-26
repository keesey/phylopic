import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { GAMES } from "~/games/GAMES"
import { GameGenerator } from "./GameGenerator"
export type Params = Readonly<{ code: string }>
export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
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
const GameDayPage = async ({ params }: { params: Params }) => {
    if (!GAMES[params.code]) {
        notFound()
    }
    return <GameGenerator code={params.code} />
}
export default GameDayPage
