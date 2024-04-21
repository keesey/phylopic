import { PropsWithChildren } from "react"
import styles from "./ControlButton.module.scss"
export type Props = PropsWithChildren<{
    disabled?: boolean
    onClick: () => void
}>
export const ControlButton = ({ children, disabled, onClick }: Props) => {
    return (
        <button className={styles.main} disabled={disabled} onClick={() => onClick()}>
            {children}
        </button>
    )
}
