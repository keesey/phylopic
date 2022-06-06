import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export interface Props {
    children?: ReactNode
}
const InlineSections: FC<Props> = ({ children }) => <div className={styles.main}>{children}</div>
export default InlineSections
