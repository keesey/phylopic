import { LoaderContext } from "@phylopic/ui"
import clsx from "clsx"
import Link from "next/link"
import { FC, ReactNode, useEffect, useState } from "react"
import SpeechStack from "../SpeechStack"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    danger?: boolean
    href: string
    icon?: string
}
const UserLinkButton: FC<Props> = ({ children, danger, download, href, icon }) => {
    const [element, setElement] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (element && typeof window !== "undefined") {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }, [element])
    if (href.startsWith("https://") || href.startsWith("http://")) {
        return (
            <a key="a" href={href} className={clsx(styles.main, danger && styles.danger)} ref={setElement}>
                <LoaderContext.Provider value={{ color: "#000" }}>
                    {" "}
                    {icon ? (
                        <SpeechStack>
                            <strong>{icon}</strong>
                            {children}
                        </SpeechStack>
                    ) : (
                        children
                    )}
                </LoaderContext.Provider>
            </a>
        )
    }
    return (
        <Link href={href}>
            <a key="a" className={clsx(styles.main, danger && styles.danger)} ref={setElement}>
                <LoaderContext.Provider value={{ color: "#000" }}>
                    {" "}
                    {icon ? (
                        <SpeechStack>
                            <strong>{icon}</strong>
                            {children}
                        </SpeechStack>
                    ) : (
                        children
                    )}
                </LoaderContext.Provider>
            </a>
        </Link>
    )
}
export default UserLinkButton