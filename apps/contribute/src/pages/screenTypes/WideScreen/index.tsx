import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
}
const WideScreen: FC<Props> = ({ children }) => <div className={styles.main}>{children}</div>
export default WideScreen
