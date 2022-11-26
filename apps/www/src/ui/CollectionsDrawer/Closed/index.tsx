import { FC, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollection from "~/collections/hooks/useCurrentCollection"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import styles from "./index.module.scss"
const Closed: FC = () => {
    const collection = useCurrentCollection()
    const name = useCurrentCollectionName()
    const [, dispatch] = useContext(CollectionsContext)
    return (
        <a onClick={() => dispatch({ type: "OPEN" })} role="button">
            <aside className={styles.main}>
                <div className={styles.toggle}>▲</div>
                {collection && name && (
                    <div className={styles.content}>
                        {collection.size} silhouette image{collection.size === 1 ? "" : "s"} in <strong>{name}</strong>
                    </div>
                )}
            </aside>
        </a>
    )
}
export default Closed
