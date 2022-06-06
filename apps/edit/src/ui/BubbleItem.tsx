import { DetailedHTMLProps, FC, LiHTMLAttributes } from "react"
import styles from "./BubbleItemOrNode.module.scss"

export type Props = Omit<DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "className"> & {
    changed?: boolean
    deleted?: boolean
    light?: boolean
}
const BubbleItem: FC<Props> = ({ changed, children, deleted, light, ...liProps }) => (
    <li
        {...liProps}
        className={[
            styles.main,
            light ? styles.light : styles.dark,
            light ? "light" : "dark",
            changed && "changed",
            deleted && "deleted",
        ]
            .filter(Boolean)
            .join(" ")}
    >
        <div className={styles.content}>{children}</div>
    </li>
)
export default BubbleItem
