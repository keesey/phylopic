import { FC } from "react"
import useCurrentCollection from "~/collections/hooks/useCurrentCollection"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import styles from "./index.module.scss"
const Closed: FC = () => {
    const collection = useCurrentCollection()
    const name = useCurrentCollectionName()
    if (!collection || !name) {
        return null
    }
    return (
        <div className={styles.main}>
            {collection.size === 0 ? (
                <em>Drag and drop silhouette images here to start a collection.</em>
            ) : (
                <>
                    <strong>{name}</strong> ({collection.size} image{collection.size === 1 ? "" : "s"})
                </>
            )}
        </div>
    )
}
export default Closed
