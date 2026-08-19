import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"

export interface Props {
    children: ReactNode
    inline?: boolean
}
const BulletList: FC<Props> = ({ children, inline }) => {
    return <ul className={clsx(styles.main, inline && styles.inline)}>{children}</ul>
}
export default BulletList
