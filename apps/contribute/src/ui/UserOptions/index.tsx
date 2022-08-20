import { FC, ReactNode } from "react"
import UserScrollTo from "../UserScrollTo"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
}
const UserOptions: FC<Props> = ({ children }) => {
    return (
        <nav className={styles.main}>
            <UserScrollTo />
            {children}
        </nav>
    )
}
export default UserOptions
