import { FC, PropsWithChildren } from "react"
import styles from "./index.module.scss"
const Warning: FC<PropsWithChildren> = ({ children }) => {
    return (
        <aside role="alert" className={styles.main}>
            {children}
        </aside>
    )
}
export default Warning
