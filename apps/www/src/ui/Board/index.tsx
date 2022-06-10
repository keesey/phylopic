import { Key, ReactNode, FC } from "react"
import styles from "./index.module.scss"
export interface Props {
    items: readonly Readonly<[Key, ReactNode, ReactNode]>[]
}
const Board: FC<Props> = ({ items }) => (
    <ul className={styles.main}>
        {items.map(([key, left, right]) => (
            <li key={key} className={styles.item}>
                {left}
                <span className={styles.spacer} />
                {right}
            </li>
        ))}
    </ul>
)
export default Board
