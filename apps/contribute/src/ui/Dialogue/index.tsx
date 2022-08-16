import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
}
const Dialogue: FC<Props> = ({ children }) => {
    return <section className={styles.main}>{children}</section>
}
export default Dialogue
