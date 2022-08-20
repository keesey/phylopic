import { FC, ReactNode } from "react"
import UserScrollTo from "../UserScrollTo"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    noAutoScroll?: boolean
}
const UserOptions: FC<Props> = ({ children, noAutoScroll }) => {
    return (
        <nav className={styles.main}>
            {children}
            {!noAutoScroll && <UserScrollTo />}
        </nav>
    )
}
export default UserOptions
