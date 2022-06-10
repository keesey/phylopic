import { MediaLink } from "@phylopic/api-models"
import { FC, useMemo } from "react"
import slugify from "slugify"
import getImageFileExtension from "~/files/getImageFileExtension"
import DimensionView from "./DimensionView"
import styles from "./DownloadLink.module.scss"
export interface Props {
    filenamePrefix: string
    link: MediaLink
}
const getDimensionTitle = (value: number | undefined) =>
    typeof value === "number" && isFinite(value) ? value.toLocaleString("en") + " pixels" : "?"
const DownLoadLink: FC<Props> = ({ filenamePrefix, link }) => {
    const [width, height] = useMemo(() => link.sizes.split("x", 2).map(parseFloat), [link.sizes])
    const filename = useMemo(
        () => `${filenamePrefix}_${slugify(link.sizes)}.${getImageFileExtension(link.type)}`,
        [filenamePrefix, link],
    )
    const title = useMemo(() => [width, height].map(getDimensionTitle).join(" × "), [height, width])
    return (
        <a className={styles.main} download={filename} href={link.href}>
            <abbr title={title}>
                <DimensionView value={width} />
                {" × "}
                <DimensionView value={height} />
            </abbr>
        </a>
    )
}
export default DownLoadLink
