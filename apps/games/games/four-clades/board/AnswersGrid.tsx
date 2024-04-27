"use client"
import { ImageThumbnailView } from "@phylopic/ui"
import { extractPath } from "@phylopic/utils"
import clsx from "clsx"
import Link from "next/link"
import { FC, useContext } from "react"
import slugify from "slugify"
import NomenView from "~/components/NomenView"
import { BoardContext, select } from "../play"
import styles from "./AnswersGrid.module.scss"
export interface AnswersGridProps {
    onNewGame?: () => void
}
const AnswersGrid: FC<AnswersGridProps> = ({ onNewGame }) => {
    const [state] = useContext(BoardContext) ?? []
    const over = Boolean(state && select.isOver(state))
    return (
        <section className={styles.main}>
            {state?.answers?.map(answer => (
                <a
                    key={answer.uuid}
                    className={clsx(styles.row, over && styles.rowGameOver)}
                    target="_blank"
                    rel="noreferrer"
                    href={
                        over
                            ? `${process.env.NEXT_PUBLIC_WWW_URL}${extractPath(answer._links.self.href)}/${slugify(answer._links.self.title, { lower: true, strict: true, trim: true })}-silhouettes`
                            : undefined
                    }
                    title={over ? "See more" : undefined}
                >
                    {answer._embedded.primaryImage && <ImageThumbnailView value={answer._embedded.primaryImage} />}
                    <header className={styles.node}>
                        <NomenView value={answer.names[0]} short />
                    </header>
                    <span className={clsx(styles.arrow, over && styles.arrowGameOver)} title="See more">
                        →
                    </span>
                </a>
            ))}
            {over && onNewGame && (
                <a className={styles.link} onClick={onNewGame}>
                    Play a new game.
                </a>
            )}
            {over && !onNewGame && (
                <Link href="/games/four-clades/practice" className={styles.link} onClick={onNewGame}>
                    Play a practice game.
                </Link>
            )}
        </section>
    )
}
export default AnswersGrid
