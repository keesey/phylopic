import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { GamePlayer } from "~/components/GamePlayer"
import { GAMES } from "~/games/GAMES"
import { formatDate, fromParams, readDateParams } from "~/lib/datetime"
import { getGameInstance } from "~/lib/s3"
export type Params = Readonly<{ code: string; year: string; month: string; day: string }>
export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
    const date = fromParams(params)
    const gameInstance = date ? await getGameInstance(params.code, date) : null
    return {
        authors: [
            {
                name: GAMES[params.code].author.name,
                url: GAMES[params.code].author.href,
            },
            ...(gameInstance
                ? [
                      {
                          name: gameInstance.meta.author.name,
                          url: gameInstance.meta.author.href,
                      },
                  ]
                : []),
        ],
        title: `${GAMES[params.code].title}${date ? ` for ${formatDate(date)}` : ""}${gameInstance ? `, edited by ${gameInstance.meta.author.name}` : ""}`,
        description: `${date ? `The ${GAMES[params.code].title} game for ${formatDate(date, "long")}. ` : ""}${GAMES[params.code].summary}`,
    }
}
const GameDayPage = async ({ params }: { params: Params }) => {
    if (!GAMES[params.code]) {
        notFound()
    }
    const date = readDateParams(params, `/games/${encodeURIComponent(params.code)}`)
    const game = await getGameInstance(params.code, date)
    if (!game) {
        return <p>No game found for this day.</p>
    }
    return <GamePlayer code={params.code} gameContent={game.content} />
}
export default GameDayPage
