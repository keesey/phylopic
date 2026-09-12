"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { GAMES } from "~/games/GAMES"
import styles from "./index.module.scss"
export const PracticeButton = () => {
    const params = useParams<{ code?: string }>()
    const game = params.code ? GAMES[params.code] : undefined
    const href = `/games${game ? `/${encodeURIComponent(params.code!)}/practice` : ""}`
    return (
        <Link className={styles.link} href={href}>
            <button className={styles.cta}>▶ {game ? "Practice Game" : "Play a Game"}</button>
        </Link>
    )
}
