import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    mode: "horizontal" | "vertical"
}
const ButtonNav: FC<Props> = ({ children, mode }) => {
    return <nav className={clsx(styles.main, styles[mode])}>{children}</nav>
}
export default ButtonNav
