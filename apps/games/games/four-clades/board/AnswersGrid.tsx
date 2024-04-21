import { ImageThumbnailView } from "@phylopic/ui"
import clsx from "clsx"
import { useContext } from "react"
import slugify from "slugify"
import NomenView from "~/components/NomenView"
import { BoardContext, select } from "../play"
import styles from "./AnswersGrid.module.scss"
import { extractPath } from "@phylopic/utils"
const AnswersGrid = () => {
    const [state] = useContext(BoardContext) ?? []
    const over = Boolean(state && select.isOver(state))
    return (
        <section className={styles.main}>
            {state?.answers.map(answer => (
                <a
                    key={answer.node.uuid}
                    className={clsx(styles.row, over && styles.rowGameOver)}
                    target="_blank"
                    rel="noreferrer"
                    href={
                        over
                            ? `${process.env.NEXT_PUBLIC_WWW_URL}${extractPath(answer.node._links.self.href)}/${slugify(answer.node._links.self.title, { lower: true, strict: true, trim: true })}-silhouettes`
                            : undefined
                    }
                    title={over ? "See more" : undefined}
                >
                    {answer.node._embedded.primaryImage && (
                        <ImageThumbnailView value={answer.node._embedded.primaryImage} />
                    )}
                    <header className={styles.node}>
                        <NomenView value={answer.node.names[0]} short />
                    </header>
                    <span className={clsx(styles.arrow, over && styles.arrowGameOver)} title="See more">
                        →
                    </span>
                </a>
            ))}
        </section>
    )
    return null
}
export default AnswersGrid
