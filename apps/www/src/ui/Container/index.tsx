import { FC, PropsWithChildren } from "react"
import styles from "./index.module.scss"
export type ContainerVariant = "page" | "full" | "varying"
export type Props = PropsWithChildren<{
    variant?: ContainerVariant
}>
const Container: FC<Props> = ({ children, variant = "page" }) => <div className={styles[variant]}>{children}</div>
export default Container
