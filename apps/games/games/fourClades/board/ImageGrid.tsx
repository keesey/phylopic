import { useContext } from "react"
import { BoardContext } from "../play"
import styles from "./ImageGrid.module.scss"
import ImageSelector from "./ImageSelector"
const ImageGrid = () => {
    const [state] = useContext(BoardContext) ?? []
    return (
        <section className={styles.main}>
            {state?.imageUUIDs
                .map(uuid => state.images[uuid])
                .filter(item => item.mode !== "completed")
                .map(item => <ImageSelector key={item.image.uuid} item={item} />)}
        </section>
    )
}
export default ImageGrid
