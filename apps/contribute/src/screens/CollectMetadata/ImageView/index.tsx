/* eslint-disable @next/next/no-img-element */
import { FC } from "react"
import styles from "./index.module.scss"
export interface Props {
    source: string | undefined
}
const ImageView: FC<Props> = ({ source }) => {
    if (!source) {
        return null
    }
    return (
        <section id="imageFile" className={styles.main}>
            <div className={styles.imageContainer}>
                <img className={styles.image} src={source} alt="Your Silhouette Image" />
            </div>
            <button className="cta">Change</button>
        </section>
    )
}
export default ImageView
