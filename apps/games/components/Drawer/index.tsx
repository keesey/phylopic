import { FC, PropsWithChildren } from "react"
import styles from "./index.module.scss"
import clsx from "clsx"
export type Props = PropsWithChildren<{
    onClose: () => void
    open: boolean
}>
export const Drawer: FC<Props> = ({ children, onClose, open }) => {
    return (
        <div className={clsx(styles.main, open ? styles.open : styles.closed)}>
            <div className={styles.container}>
                <button className={styles.close} onClick={() => onClose()}>
                ▼
                </button>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    )
}
