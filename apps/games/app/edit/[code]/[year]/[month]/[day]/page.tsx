import { Metadata } from "next"
import { notFound } from "next/navigation"
import { GameEditor } from "~/components/GameEditor"
import { GameGenerator } from "~/components/GameGenerator"
import { GAMES } from "~/games/GAMES"
import { formatDate, fromParams, readDateParams } from "~/lib/datetime"
import { normalizeDate } from "~/lib/datetime/normalizeDate"
import { getGameInstance } from "~/lib/s3"
import styles from "./page.module.scss"
import { toDate } from "~/lib/datetime/toDate"
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
    if (!game) {
        notFound()
    }
    const now = Date.now()
    const date = readDateParams(params, `/edit/${encodeURIComponent(params.code)}`)
    const inPast = now >= toDate(date).getTime()
    const gameInstance = await getGameInstance(params.code, date)
    if (!gameInstance) {
        return (
            <div className={styles.main}>
                <p className={styles.message}>No game found for this date.</p>
                <GameGenerator code={params.code} date={date} />
            </div>
        )
    }
    return <GameEditor code={params.code} date={date} initialGameInstance={gameInstance} readOnly={inPast} />
}
export default EditGameDayPage
