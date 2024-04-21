import { Metadata } from "next"
import { notFound } from "next/navigation"
import { GAMES } from "~/games/GAMES"
import styles from "./page.module.scss"
export type Params = { code: string }
export const generateMetadata = ({ params }: { params: Params }): Metadata => {
    const game = GAMES[params.code]
    return {
        title: `${game ? `${game.title} | ` : ""}PhyloPic Games Editor`,
        robots: {
            index: false,
            follow: false,
        },
    }
}
const EditGamePage = ({ params }: { params: Params }) => {
    const game = GAMES[params.code]
    if (!game) {
        notFound()
    }
    return <p className={styles.main}>Select a date to get started.</p>
}
export default EditGamePage
