import { FC, ReactNode } from "react"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
}
const ImageGrid: FC<Props> = ({ children }) => {
    return <div className={styles.main}>{children}</div>
}
export default ImageGrid
