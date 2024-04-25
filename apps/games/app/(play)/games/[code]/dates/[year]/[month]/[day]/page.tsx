import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { GamePlayer } from "~/components/GamePlayer"
import { GAMES } from "~/games/GAMES"
import { formatDate, fromDate, fromParams, readDateParams, toISOString } from "~/lib/datetime"
import { getGameInstance } from "~/lib/s3"
export type Params = Readonly<{ code: string; year: string; month: string; day: string }>
import styles from "./page.module.scss"
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
    const today = fromDate(new Date())
    const date = readDateParams(params, `/games/${encodeURIComponent(params.code)}/dates`)
    console.debug(toISOString(today), toISOString(date))
    if (toISOString(today) < toISOString(date)) {
        return (
            <>
                <p className={styles.paragraph}>
                    Come back on{" "}
                    <time className={styles.time} dateTime={toISOString(date)}>
                        {formatDate(date, "long")}
                    </time>{" "}
                    to play this game.
                </p>
                <p className={styles.paragraph}>
                    <Link className={styles.link} href={`/games/${encodeURIComponent(params.code)}/dates`}>
                        Play today&rsquo;s game.
                    </Link>
                </p>
            </>
        )
    }
    const game = await getGameInstance(params.code, date)
    if (!game) {
        return (
            <>
                <p className={styles.paragraph}>
                    No game found for <time className={styles.time} dateTime={toISOString(date)}>
                        {formatDate(date, "long")}
                    </time>.
                </p>
                {toISOString(today) !== toISOString(date) &&  <p className={styles.paragraph}>
                    <Link className={styles.link} href={`/games/${encodeURIComponent(params.code)}/dates`}>
                        Play today&rsquo;s game.
                    </Link>
                </p>}
                {toISOString(today) === toISOString(date) &&  <p className={styles.paragraph}>
                    <Link className={styles.link} href={`/games/${encodeURIComponent(params.code)}/practice`}>
                        Play a practice game.
                    </Link>
                </p>}
            </>
        )
    }
    return <GamePlayer code={params.code} gameContent={game.content} />
}
export default GameDayPage
