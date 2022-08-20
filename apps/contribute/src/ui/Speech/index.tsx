import { LoaderContext } from "@phylopic/ui"
import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    mode: "system" | "user"
}
const Speech: FC<Props> = ({ children, mode }) => {
    return (
        <section className={clsx(styles.main, styles[mode])}>
            <LoaderContext.Provider value={{ color: mode === "user" ? "#00000" : "#00809f" }}>
                {children}
            </LoaderContext.Provider>
        </section>
    )
}
export default Speech
