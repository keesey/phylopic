import { FC, ReactNode, useEffect } from "react"
import styles from "./Modal.module.scss"

export interface Props {
    children?: ReactNode
    onClose?: () => void
    title?: ReactNode
}
const Modal: FC<Props> = ({ children, onClose, title }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose?.()
            }
        }
        document.body.addEventListener("keydown", handleKeyDown)
        return () => document.body.removeEventListener("keydown", handleKeyDown)
    }, [onClose])
    return (
        <div className={styles.container}>
            <section className={styles.modal}>
                <header>
                    {title && <h2>{title}</h2>}
                    <button className={styles.close} onClick={onClose}>
                        ✕
                    </button>
                </header>
                <div className={styles.content}>{children}</div>
            </section>
        </div>
    )
}
export default Modal
