import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react"
import styles from "./BubbleList.module.scss"

export type Props = Omit<DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "className">
const BubbleList: FC<Props> = ({ children, ...ulProps }) => (
    <ul {...ulProps} className={styles.main}>
        {children}
    </ul>
)
export default BubbleList
