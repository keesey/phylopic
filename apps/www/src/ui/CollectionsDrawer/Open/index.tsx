import { FC, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import Collections from "./Collections"
import Images from "./Images"
import styles from "./index.module.scss"
const Open: FC = () => {
    const [, dispatch] = useContext(CollectionsContext)
    return (
        <aside className={styles.main}>
            <a className={styles.toggle} onClick={() => dispatch({ type: "CLOSE" })} role="button">
                ▼
            </a>
            <Collections />
            <Images />
        </aside>
    )
}
export default Open
