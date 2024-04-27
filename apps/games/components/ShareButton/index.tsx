"use client"
import { useParams, usePathname } from "next/navigation"
import { GAMES } from "~/games/GAMES"
import { formatDate, fromParams, toPath } from "~/lib/datetime"
import styles from "./index.module.scss"
export const ShareButton = () => {
    const params = useParams<{ code?: string; year?: string; month?: string; day?: string }>()
    const handleClick = () => {
        const game = params.code ? GAMES[params.code] : undefined
        if (!game) {
            return alert("Invalid game.")
        }
        const date = fromParams(params)
        const data: ShareData = {
            text: `${game.summary}. (PhyloPic Game by ${game.author})`,
            title: `${game.title}${date ? ` game for ${formatDate(date)} | PhyloPic Games` : ", a daily game from PhyloPic"}`,
            url: `${process.env.NEXT_PUBLIC_GAMES_URL}/games/${encodeURIComponent(params.code!)}${date ? `/dates${toPath(date)}` : ""}`,
        }
        if (navigator.canShare?.(data)) {
            navigator.share(data).catch(() => {})
        } else {
            navigator.clipboard.writeText(data.url!)
            alert("Link copied to clipboard.")
        }
    }
    return (
        <button className={styles.main} onClick={handleClick}>
            ⇑ Share Game
        </button>
    )
}
