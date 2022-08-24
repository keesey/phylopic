import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    disabled?: boolean
    icon: ReactNode
    label: ReactNode
    onClick: () => void
}
const MenuButton: FC<Props> = ({ disabled, icon, label, onClick }) => {
    return (
        <li className={clsx(styles.main, disabled && styles.disabled)} role="menuitem">
            <a className={styles.link} onClick={disabled ? undefined : onClick} role="button">
                <span className={styles.icon}>{icon}</span>
                <span className={styles.label}>{label}</span>
            </a>
        </li>
    )
}
export default MenuButton
