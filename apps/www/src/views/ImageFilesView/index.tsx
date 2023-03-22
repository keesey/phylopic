import { Image } from "@phylopic/api-models"
import { useLicenseText } from "@phylopic/ui"
import { isString } from "@phylopic/utils"
import { FC, useMemo } from "react"
import slugify from "slugify"
import compareMediaLinks from "~/models/compareMediaLinks"
import getImageFileExtension from "../../files/getImageFileExtension"
import DownLoadLink from "./DownloadLink"
import styles from "./index.module.scss"
export interface Props {
    value: Image
}
const EXTENSION_LINKS: Readonly<Record<string, string>> = {
    png: "http://www.libpng.org/pub/png/spec/1.2/PNG-Contents.html",
    svg: "https://www.w3.org/TR/SVG/",
}
const ImageFilesView: FC<Props> = ({ value }) => {
    const licenseShort = useLicenseText(value._links.license.href, true)
    const filenamePrefix = useMemo(
        () =>
            [value._links.self.title, value.attribution, licenseShort, value.uuid]
                .filter(isString)
                .map(s => slugify(s ?? ""))
                .join("_"),
        [value, licenseShort],
    )
    const sourceFileExtension = useMemo(
        () => getImageFileExtension(value._links.sourceFile.type).toUpperCase(),
        [value._links.sourceFile.type],
    )
    const rasterFiles = useMemo(() => [...value._links.rasterFiles].sort(compareMediaLinks), [value._links.rasterFiles])
    const thumbnailFiles = useMemo(
        () => [...value._links.thumbnailFiles].sort(compareMediaLinks),
        [value._links.thumbnailFiles],
    )
    return (
        <table>
            <tbody>
                {value._links.vectorFile && (
                    <tr key="vector">
                        <th>
                            {sourceFileExtension === "SVG" ? "Vector" : "Vectorized"}
                            {" File ("}
                            <a href={EXTENSION_LINKS.svg} rel="external">
                                <abbr title="Scalable Vector Graphics">SVG</abbr>
                            </a>
                            )
                        </th>
                        <td className={styles.cellList}>
                            <DownLoadLink filenamePrefix={filenamePrefix} link={value._links.vectorFile} />
                            &nbsp;
                            <i>
                                (Scales to any resolution.
                                {sourceFileExtension !== "SVG" && " May look different from original."})
                            </i>
                        </td>
                    </tr>
                )}
                <tr key="raster">
                    <th>
                        Alternate Sizes (
                        <a href={EXTENSION_LINKS.png} rel="external">
                            <abbr title="Portable Network Graphics">PNG</abbr>
                        </a>
                        )
                    </th>
                    <td className={styles.cellList}>
                        {rasterFiles.map(link => (
                            <DownLoadLink key={link.href} filenamePrefix={filenamePrefix} link={link} />
                        ))}
                    </td>
                </tr>
                <tr key="thumbnail">
                    <th>
                        Thumbnails (
                        <a href={EXTENSION_LINKS.png} rel="external">
                            <abbr title="Portable Network Graphics">PNG</abbr>
                        </a>
                        )
                    </th>
                    <td className={styles.cellList}>
                        {thumbnailFiles.map(link => (
                            <DownLoadLink key={link.href} filenamePrefix={filenamePrefix} link={link} />
                        ))}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
export default ImageFilesView
