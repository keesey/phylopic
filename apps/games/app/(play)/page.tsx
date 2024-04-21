import { Metadata } from "next"
import styles from "./page.module.scss"
import Image from "next/image"
import { GAMES } from "~/games/GAMES"
import Link from "next/link"
import { fromDate, toPath } from "~/lib/datetime"
export const metadata: Metadata = {
    title: "PhyloPic Games",
    description: "Puzzle games that use silhouette images from PhyloPic.",
}
const GAME_CODES = ["four-clades", "ancestor"]
const Page = () => {
    const todayPath = toPath(fromDate(new Date()))
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Today&rsquo;s Puzzles</h2>
            <section className={styles.games}>
                {GAME_CODES.map(code => (
                    <section key={code} className={styles.game}>
                        <header className={styles.gameHeading}>
                            <Image
                                src={`/games/${encodeURIComponent(code)}/icon.svg`}
                                alt=""
                                width={64}
                                height={64}
                                unoptimized
                            />
                            <h3>{GAMES[code].title}</h3>
                            <h4>
                                by{" "}
                                <Link href={GAMES[code].author.href} target="_blank" rel="noreferrer">
                                    {GAMES[code].author.name}
                                </Link>
                            </h4>
                        </header>
                        <section className={styles.gameContent}>
                            <Link href={`/games/${code}${todayPath}`}>
                                <button className={styles.cta}>Play</button>
                            </Link>
                        </section>
                    </section>
                ))}
            </section>
        </div>
    )
}
export default Page
