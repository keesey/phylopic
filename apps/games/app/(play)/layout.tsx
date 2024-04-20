import { PropsWithChildren, ReactNode } from "react"
import styles from "./layout.module.scss"
import MenuButton from "./_navigation/MenuButton"
const PlayLayout = ({ children, controls, title }: PropsWithChildren<{ controls: ReactNode; title: ReactNode }>) => {
    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <MenuButton />
                <h1 className={styles.heading}>{title}</h1>
                <div className={styles.controls}>{controls}</div>
            </nav>
            <div className={styles.mainContainer}>
                <main className={styles.main}>{children}</main>
            </div>
        </div>
    )
}
export default PlayLayout
