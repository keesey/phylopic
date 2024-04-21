import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { GAMES } from "~/games/GAMES"
import { GAME_CODES } from "~/games/GAME_CODES"
import styles from "./page.module.scss"
export const metadata: Metadata = {
    title: "PhyloPic Games Editor",
    robots: {
        index: false,
        follow: false,
    },
}
const Page = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Games to Edit</h2>
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
                            <Link href={`/edit/${code}`}>
                                <button className={styles.cta}>Edit</button>
                            </Link>
                        </section>
                    </section>
                ))}
            </section>
        </div>
    )
}
export default Page
