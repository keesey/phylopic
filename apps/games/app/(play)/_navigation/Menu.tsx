"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FC } from "react"
import { Drawer } from "~/components/Drawer"
import { GAMES } from "~/games/GAMES"
import { fromDate, toPath } from "~/lib/datetime"
import styles from "./Menu.module.scss"
const WWW_URL = process.env.NEXT_PUBLIC_WWW_URL ?? "https://www.phylopic.org"
const CONTRIBUTE_URL = process.env.NEXT_PUBLIC_CONTRIBUTE_URL ?? "https://contribute.phylopic.org"
export interface Props {
    onClose: () => void
}
const Menu: FC<Props> = ({ onClose }) => {
    const { code } = useParams<{ code?: string }>()
    const game = code ? GAMES[code] : undefined
    const todayPath = toPath(fromDate(new Date()))
    return (
        <Drawer open onClose={onClose}>
            <header>
                <h2>Menu</h2>
            </header>
            <nav className={styles.nav}>
                <Link href="/" onClick={onClose}>
                    Today&rsquo;s Puzzles
                </Link>
                {code && game && (
                    <>
                        <Link href={`/games/${encodeURIComponent(code)}/dates${todayPath}`} onClick={onClose}>
                            Today&rsquo;s {game.title}
                        </Link>
                        <Link href={`/games/${encodeURIComponent(code)}/practice`} onClick={onClose}>
                            Practice {game.title}
                        </Link>
                    </>
                )}
                <Link href={WWW_URL} onClick={onClose} target="_blank" rel="noreferrer">
                    PhyloPic
                </Link>
                <Link href={CONTRIBUTE_URL} onClick={onClose} target="_blank" rel="noreferrer">
                    Contribute
                </Link>
            </nav>
        </Drawer>
    )
}
export default Menu
