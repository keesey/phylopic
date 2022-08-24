import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    disabled?: boolean
    label: ReactNode
    onToggle?: () => void
    selected: boolean
}
const NavItem: FC<Props> = ({ disabled, label, onToggle, selected }) => {
    return (
        <div className={clsx(styles.main, selected && styles.selected)} role="menuitem">
            <a
                aria-disabled={disabled}
                className={clsx(styles.main, disabled && styles.disabled)}
                onClick={disabled ? undefined : onToggle}
                role="button"
            >
                {label}
            </a>
        </div>
    )
}
export default NavItem
