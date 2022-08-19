import clsx from "clsx"
import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
    compact?: boolean
    fullWidth?: boolean
}
const SpeechStack: FC<Props> = ({ children, compact, fullWidth }) => {
    return (
        <section className={clsx(styles.main, compact && styles.compact, fullWidth && styles.fullWidth)}>
            {children}
        </section>
    )
}
export default SpeechStack
