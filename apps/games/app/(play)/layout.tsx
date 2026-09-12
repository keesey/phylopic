import { PropsWithChildren, ReactNode } from "react"
import InfoButton from "./_navigation/InfoButton"
import MenuButton from "./_navigation/MenuButton"
import styles from "./layout.module.scss"
const PlayLayout = ({ children, title }: PropsWithChildren<{ title: ReactNode }>) => {
    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <MenuButton />
                <h1 className={styles.heading}>{title}</h1>
                <div className={styles.controls}>
                    <InfoButton />
                </div>
            </nav>
            <div className={styles.mainContainer}>
                <main className={styles.main}>{children}</main>
            </div>
        </div>
    )
}
export default PlayLayout
