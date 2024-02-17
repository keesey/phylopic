import { ImageWithEmbedded } from "@phylopic/api-models"
import { FC, useMemo } from "react"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
export interface Props {
    images: readonly ImageWithEmbedded[]
}
const CollectionSponsors: FC<Props> = ({ images }) => {
    const [sponsors, numSponsored] = useMemo<[readonly string[], number]>(() => {
        const result = new Set<string>()
        let num = 0
        for (const image of images) {
            if (image.sponsor) {
                result.add(image.sponsor)
                num++
            }
        }
        return [Array.from(result).sort(), num]
    }, [images])
    const separator = useMemo(() => {
        return sponsors.some(attribution => attribution.indexOf(",") >= 0) ? ";" : ","
    }, [sponsors])
    const numSponsors = sponsors.length
    const hasSponsors = numSponsors > 0
    const numImages = images.length
    const singleImage = numImages === 1
    if (!hasSponsors) {
        return null
    }
    return (
        <p id="sponsors" className={styles.main}>
            {singleImage
                ? "This silhouette’s inclusion "
                : `Inclusion${numSponsored === numImages ? "" : " of some"} of these silhouettes `}
            in <SiteTitle /> has been sponsored by{" "}
            <ul>
                {sponsors.map((sponsor, index, array) => (
                    <li key={sponsor}>
                        {index && array.length > 2 ? separator : null}
                        {index && index === array.length - 1 ? " and " : " "}
                        {sponsor}
                    </li>
                ))}
            </ul>
            .
        </p>
    )
}
export default CollectionSponsors
