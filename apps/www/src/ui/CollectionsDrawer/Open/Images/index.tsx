import { AnchorLink, ImageThumbnailView } from "@phylopic/ui"
import { FC, useContext } from "react"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollectionImages from "~/collections/hooks/useCurrentCollectionImages"
import LinkedImageThumbnailView from "~/views/LinkedImageThumbnailView"
import styles from "./index.module.scss"
const Images: FC = () => {
    const images = useCurrentCollectionImages()
    const [, dispatch] = useContext(CollectionsContext)
    return (
        <section className={styles.main}>
            {images.map(image => (
                <section key={image.uuid}>
                    <LinkedImageThumbnailView value={image} />
                    <div>
                        <a
                            className={styles.close}
                            onClick={() => dispatch({ type: "REMOVE_FROM_CURRENT_COLLECTION", payload: image.uuid })}
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
