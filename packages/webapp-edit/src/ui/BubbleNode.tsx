import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react"
import styles from "./BubbleItemOrNode.module.scss"

export type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    changed?: boolean
    deleted?: boolean
    light?: boolean
}
const BubbleNode: FC<Props> = ({ changed, children, className, deleted, light, ...divProps }) => (
    <div
        {...divProps}
        className={[
            styles.main,
            light ? styles.light : styles.dark,
            light ? "light" : "dark",
            changed && "changed",
            deleted && "deleted",
            className,
        ]
            .filter(Boolean)
            .join(" ")}
    >
        <div className={styles.content}>{children}</div>
    </div>
)
export default BubbleNode
