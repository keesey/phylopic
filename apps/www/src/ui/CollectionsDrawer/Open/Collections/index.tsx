import { FC } from "react"
import useCollectionNames from "~/collections/hooks/useCollectionNames"
import Add from "./Add"
import styles from "./index.module.scss"
import Tab from "./Tab"
const Collections: FC = () => {
    const collectionNames = useCollectionNames()
    return (
        <nav className={styles.main}>
            {collectionNames.map(name => (
                <Tab key={name} name={name} />
            ))}
            <Add />
        </nav>
    )
}
export default Collections
