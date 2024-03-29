import { FC, useContext } from "react"
import customEvents from "~/analytics/customEvents"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollectionImages from "~/collections/hooks/useCurrentCollectionImages"
import LinkedImageThumbnailView from "~/views/LinkedImageThumbnailView"
import styles from "./index.module.scss"
const Images: FC = () => {
    const images = useCurrentCollectionImages()
    const [{ currentCollection }, dispatch] = useContext(CollectionsContext)
    return (
        <section className={styles.main}>
            {!images.length && (
                <p>
                    <em>Drag and drop silhouette images here to add them.</em>
                </p>
            )}
            {images.map(image => (
                <section key={image.uuid}>
                    <LinkedImageThumbnailView inverted value={image} />
                    <div>
                        <a
                            onClick={() => {
                                customEvents.removeFromCollection(currentCollection, image)
                                dispatch({ type: "REMOVE_FROM_CURRENT_COLLECTION", payload: image.uuid })
                            }}
                            role="button"
                            title="Remove"
                        >
                            ✖
                        </a>
                    </div>
                </section>
            ))}
        </section>
    )
}
export default Images
