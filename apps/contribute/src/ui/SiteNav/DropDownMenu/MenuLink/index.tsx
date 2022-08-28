import { AnchorLink } from "@phylopic/ui"
import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    disabled?: boolean
    href: string
    icon: ReactNode
    isExternal?: boolean
    label: ReactNode
}
const MenuLink: FC<Props> = ({ disabled, href, icon, isExternal, label }) => {
    return (
        <li className={clsx(styles.main, disabled && styles.disabled)} role="menuitem">
            {isExternal ? (
                <a className={styles.link} href={disabled ? "#" : href} target="_blank" rel="noreferrer">
                    <span className={styles.icon}>{icon}</span>
                    <span className={styles.label}>{label}</span>
                </a>
            ) : (
                <AnchorLink className={styles.link} href={disabled ? "#" : href}>
                    <span className={styles.icon}>{icon}</span>
                    <span className={styles.label}>{label}</span>
                </AnchorLink>
            )}
        </li>
    )
}
export default MenuLink
