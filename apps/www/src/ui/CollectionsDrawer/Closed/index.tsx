import { FC } from "react"
import useCurrentCollection from "~/collections/hooks/useCurrentCollection"
import useCurrentCollectionName from "~/collections/hooks/useCurrentCollectionName"
import styles from "./index.module.scss"
import clsx from "clsx"
import Link from "next/link"
import Icon from "~/ui/Icon"
const Closed: FC = () => {
    const collection = useCurrentCollection()
    const name = useCurrentCollectionName()
    if (!collection || !name) {
        return null
    }
    return (
        <div className={clsx(styles.main, collection.size === 0 ? styles.empty : undefined)}>
            {collection.size === 0 ? (
                <em>
                    Drag <span className={styles.optional2}>and drop </span>
                    <span className={styles.optional}>silhouette </span>images here to start a collection.
                </em>
            ) : (
                <>
                    <strong>{name}</strong> ({collection.size} image{collection.size === 1 ? "" : "s"})
                </>
            )}
            {collection.size === 0 && (
                <>
                    {" "}
                    <Link
                        href="/articles/image-usage"
                        className={clsx(styles.icon)}
                        role="button"
                        title="More Information"
                    >
                        <Icon name="info" />
                    </Link>
                </>
            )}
        </div>
    )
}
export default Closed
