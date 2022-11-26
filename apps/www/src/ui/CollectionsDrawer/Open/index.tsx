import { FC, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import Collections from "./Collections"
import Images from "./Images"
import styles from "./index.module.scss"
const Open: FC = () => {
    const [,dispatch] = useContext(CollectionsContext)
    const name = useCurrentCollectionName()
    return (
        <aside className={styles.main}>
            <a className={styles.toggle} onClick={() => dispatch({ type: "CLOSE" })} role="button">
                ▼
            </a>
            <h2 className={styles.header}>{name ?? "Your Collections"}</h2>
            {!name && <Collections />}
            {name && <Images />}
        </aside>
    )
}
export default Open
