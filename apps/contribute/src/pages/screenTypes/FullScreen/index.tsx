import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
}
const FullScreen: FC<Props> = ({ children }) => <div className={styles.main}>{children}</div>
export default FullScreen
