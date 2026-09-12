import { FC, ReactNode } from "react"
import styles from "./index.module.scss"

export interface Props {
    children: ReactNode
    inline?: boolean
}
const BulletList: FC<Props> = ({ children, inline }) => {
    return <ul className={inline ? styles.inline : styles.main}>{children}</ul>
}
export default BulletList
