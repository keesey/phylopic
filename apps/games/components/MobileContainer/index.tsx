import { FC, PropsWithChildren } from "react"
import styles from "./index.module.scss"
export const MobileContainer: FC<PropsWithChildren> = ({ children }) => {
    return <div className={styles.main}>{children}</div>
}
