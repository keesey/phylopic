import { LoaderContext } from "@phylopic/ui"
import clsx from "clsx"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    mode: "system" | "user"
}
const Speech: FC<Props> = ({ children, mode }) => {
    const [element, setElement] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (element && typeof window !== "undefined") {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }, [element])
    return (
        <section className={clsx(styles.main, styles[mode])} ref={setElement}>
            <LoaderContext.Provider value={{ color: mode === "user" ? "#00000" : "#00809f" }}>
                {children}
            </LoaderContext.Provider>
        </section>
    )
}
export default Speech
