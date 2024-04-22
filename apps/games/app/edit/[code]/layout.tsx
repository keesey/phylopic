import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"
import { GAMES } from "~/games/GAMES"
import styles from "./layout.module.scss"
import { CalendarNav } from "./CalendarNav"
export type Params = { code: string }
const EditGameLayout = ({ children, params }: { children: ReactNode; params: Params }) => {
    const game = GAMES[params.code]
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <header className={styles.heading}>
                    <Image
                        alt=""
                        height={24}
                        src={`/games/${encodeURIComponent(params.code)}/icon.svg`}
                        width={24}
                        unoptimized
                    />
                    <div>
                        <h2>{game.title}</h2>{" "}
                        <h3>
                            by{" "}
                            <Link href={game.author.href} target="_blank" rel="noreferrer">
                                {game.author.name}
                            </Link>
                        </h3>
                    </div>
                </header>
                <div className={styles.content}>{children}</div>
            </div>
            <CalendarNav />
        </div>
    )
}
export default EditGameLayout
