import { Metadata } from "next"
import { notFound } from "next/navigation"
import { GAMES } from "~/games/GAMES"
import styles from "./page.module.scss"
import Image from "next/image"
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
            <h2 className={styles.heading}>{game.title}</h2>
        </div>
    )
}
export default Page
