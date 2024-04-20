import SiteTitle from "~/components/SiteTitle"
import styles from "./layout.module.scss"
import { PropsWithChildren, ReactNode } from "react"
import Link from "next/link"
const EditLayout = ({ children, nav }: PropsWithChildren<{ nav: ReactNode }>) => {
    return (
        <>
            <nav className={styles.nav}>
                <Link href="/edit">
                    <h1 className={styles.header}>
                        <SiteTitle /> Games Editor
                    </h1>
                </Link>
                {nav}
            </nav>
            <main className={styles.main}>{children}</main>
        </>
    )
}
export default EditLayout
