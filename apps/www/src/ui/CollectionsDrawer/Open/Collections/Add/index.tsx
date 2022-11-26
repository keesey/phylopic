import clsx from "clsx"
import { FC, useCallback, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import styles from "./index.module.scss"
const Add: FC = () => {
    const [, dispatch] = useContext(CollectionsContext)
    const handleAddClick = useCallback(() => {
        const payload = prompt("What do you want to call your new collection?")
        if (payload) {
            dispatch({ type: "ADD_COLLECTION", payload })
        }
    }, [dispatch])
    return (
        <div className={styles.main}>
            <a onClick={handleAddClick} className={clsx(styles.icon)} role="button" title="Add New Collection">
                ＋
            </a>
        </div>
    )
}
export default Add
