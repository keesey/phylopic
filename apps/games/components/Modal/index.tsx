import { FC, PropsWithChildren } from "react"
import styles from "./index.module.scss"
export type Props = PropsWithChildren<{
    onClose: () => void
}>
export const Modal: FC<Props> = ({ children, onClose }) => {
    return (
        <div className={styles.main}>
            <div className={styles.content}>{children}</div>
            <button className={styles.close} onClick={() => onClose()}>
                ×
            </button>
        </div>
    )
}
