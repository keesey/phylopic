import { FC, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCollectionNames from "~/collections/hooks/useCollectionNames"
import useCurrentCollection from "~/collections/hooks/useCurrentCollection"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import styles from "./index.module.scss"
const Closed: FC = () => {
    const collection = useCurrentCollection()
    const collections = useCollectionNames()
    const name = useCurrentCollectionName()
    const [,dispatch] = useContext(CollectionsContext)
    return (
        <a onClick={() => dispatch({ type: "OPEN" })} role="button">
            <aside className={styles.main}>
                <span className={styles.toggle}>▲</span>
                <span>
                    {collection && (
                        <>
                            {collection.size} silhouette image{collection.size === 1 ? "" : "s"} in{" "}
                            <strong>{name}</strong>
                        </>
                    )}
                    {!collection && `${collections.length} collection${collections.length === 1 ? "" : "s"}`}
                </span>
            </aside>
        </a>
    )
}
export default Closed
