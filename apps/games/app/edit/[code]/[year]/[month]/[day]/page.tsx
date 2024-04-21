import { Metadata } from "next"
import { GAMES } from "~/games/GAMES"
import { formatDate, fromParams, readDateParams } from "~/lib/datetime"
import { normalizeDate } from "~/lib/datetime/normalizeDate"
import { getGameInstance } from "~/lib/s3"
export type Params = { code: string; year: string; month: string; day: string }
export const generateMetadata = ({ params }: { params: Params }): Metadata => {
    const game = GAMES[params.code]
    const date = fromParams(params)
    return {
        title: `${game ? `${game.title} | ` : ""}${date ? `${formatDate(normalizeDate(date), "short")} | ` : ""}PhyloPic Games Editor`,
        robots: {
            index: false,
            follow: false,
        },
    }
}
const EditGameDayPage = async ({ params }: { params: Params }) => {
    const game = GAMES[params.code]
    const date = readDateParams(params, `/edit/${encodeURIComponent(params.code)}`)
    const gameInstance = await getGameInstance(params.code, date)
    if (!gameInstance) {
        return <p>No game found for this day.</p>
    }
    return <p>Game will go here.</p>
}
export default EditGameDayPage
