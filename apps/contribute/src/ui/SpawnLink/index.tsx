import clsx from "clsx"
import { FC, ReactNode, useEffect } from "react"
import useImageSpawn from "~/editing/hooks/useImageSpawn"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
}
const SpawnLink: FC<Props> = ({ children }) => {
    const [spawn, error, pending] = useImageSpawn()
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    return (
        <a className={clsx(styles.main, pending && styles.pending)} onClick={spawn}>
            {children}
        </a>
    )
}
export default SpawnLink
