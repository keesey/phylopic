import Link from "next/link"
import { PropsWithChildren } from "react"
import SiteTitle from "~/components/SiteTitle"
import { GAME_CODES } from "~/games/GAME_CODES"
import styles from "./layout.module.scss"
import Image from "next/image"
import { GAMES } from "~/games/GAMES"
const EditLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <nav className={styles.nav}>
                <h1 className={styles.heading}>
                    <Link href="/edit">
                        <SiteTitle /> Games Editor
                    </Link>
                </h1>
                <section className={styles.games}>
                    {GAME_CODES.map(code => (
                        <Link key={code} href={`/edit/${encodeURIComponent(code)}`}>
                            <Image
                                src={`/games/${encodeURIComponent(code)}/icon.svg`}
                                width={24}
                                height={24}
                                alt={GAMES[code].title}
                            />
                        </Link>
                    ))}
                </section>
            </nav>
            <main className={styles.main}>{children}</main>
        </>
    )
}
export default EditLayout
