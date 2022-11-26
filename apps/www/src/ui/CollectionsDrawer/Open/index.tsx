import { FC } from "react"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import Collections from "./Collections"
import Images from "./Images"
import styles from "./index.module.scss"
export interface Props {
    onClose: () => void
}
const Open: FC<Props> = ({ onClose }) => {
    const name = useCurrentCollectionName()
    return (
        <aside className={styles.main}>
            <a className={styles.toggle} onClick={onClose} role="button">▼</a>
            <h2 className={styles.header}>{name ?? "Your Collections"}</h2>
            {!name && <Collections />}
            {name && <Images />}
        </aside>
    )
}
export default Open
