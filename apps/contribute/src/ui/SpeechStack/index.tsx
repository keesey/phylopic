import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    collapsible?: boolean
    compact?: boolean
    fullWidth?: boolean
}
const SpeechStack: FC<Props> = ({ children, collapsible, compact, fullWidth }) => {
    return (
        <section
            className={clsx(
                styles.main,
                compact && styles.compact,
                collapsible && styles.collapsible,
                fullWidth && styles.fullWidth,
            )}
        >
            {children}
        </section>
    )
}
export default SpeechStack
