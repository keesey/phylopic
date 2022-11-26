import { FC } from "react"
import useCollectionNames from "~/collections/hooks/useCollectionNames"
import useCurrentCollection from "~/collections/hooks/useCurrentCollection"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import styles from "./index.module.scss"
export interface Props {
    onOpen: () => void
}
const Closed: FC<Props> = ({ onOpen }) => {
    const collection = useCurrentCollection()
    const collections = useCollectionNames()
    const name = useCurrentCollectionName()
    return (
        <a onClick={onOpen} role="button">
            <aside className={styles.main}>
                <span className={styles.toggle}>▲</span>
                <span>
                {collection &&
                    <>{collection.size} silhouette image{collection.size === 1 ? "" : "s"} in <strong>{name}</strong></>}
                {!collection && `${collections.length} collection${collections.length === 1 ? "" : "s"}`}
                </span>
            </aside>
        </a>
    )
}
export default Closed
