import { FC, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollection from "~/collections/hooks/useCurrentCollection"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import styles from "./index.module.scss"
const Closed: FC = () => {
    const collection = useCurrentCollection()
    const name = useCurrentCollectionName()
    const [, dispatch] = useContext(CollectionsContext)
    if (!collection || !name) {
        return null
    }
    return (
        <div className={styles.main}>
            <strong>{name}</strong> ({collection.size} image{collection.size === 1 ? "" : "s"})
        </div>
    )
}
export default Closed
