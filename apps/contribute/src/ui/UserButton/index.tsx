import { LoaderContext } from "@phylopic/ui"
import clsx from "clsx"
import { FC, ReactNode, useEffect, useState } from "react"
import SpeechStack from "../SpeechStack"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    icon?: ReactNode
    danger?: boolean
    onClick?: () => void
}
const UserButton: FC<Props> = ({ children, icon, danger, onClick }) => {
    const [element, setElement] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (element && typeof window !== "undefined") {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }, [element])
    return (
        <button
            className={clsx(styles.main, danger && styles.danger, !onClick && styles.wait)}
            onClick={onClick}
            ref={setElement}
        >
            <LoaderContext.Provider value={{ color: "#000" }}>
                {icon ? (
                    <SpeechStack>
                        <strong>{icon}</strong>
                        {children}
                    </SpeechStack>
                ) : (
                    children
                )}
            </LoaderContext.Provider>
        </button>
    )
}
export default UserButton
