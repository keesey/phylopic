import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { GAMES } from "~/games/GAMES"
import { Today } from "./Today"
import styles from "./page.module.scss"
import { TodayFallback } from "./TodayFallback"
export const metadata: Metadata = {
    title: "PhyloPic Games",
    description: "Puzzle games that use silhouette images from PhyloPic.",
}
const Page = ({ params }: { params: { code: string } }) => {
    const game = GAMES[params.code]
    if (!game) {
        notFound()
    }
    return (
        <div className={styles.container}>
            <Image src={`/games/${encodeURIComponent(params.code)}/icon.svg`} width={64} height={64} alt="" />
            <h2>{game.title}</h2>
            <h4>
                by{" "}
                <Link href={game.author.href} target="_blank" rel="noreferrer">
                    {game.author.name}
                </Link>
            </h4>
            <p className={styles.summary}>{game.summary}</p>
            <Suspense fallback={<TodayFallback />}>
                <Today code={params.code} />
            </Suspense>
        </div>
    )
}
export default Page
