import { LoaderContext } from "@phylopic/client-components"
import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    mode: "system" | "user" | "user-input"
}
const Speech: FC<Props> = ({ children, mode }) => {
    return (
        <section className={clsx(styles.main, styles[mode])}>
            <LoaderContext.Provider value={{ color: mode === "system" ? "#00809f" : "#000000" }}>
                {children}
            </LoaderContext.Provider>
        </section>
    )
}
export default Speech
