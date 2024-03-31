import { Image } from "@phylopic/api-models"
import { useLicenseText } from "@phylopic/ui"
import { isString } from "@phylopic/utils"
import { FC, useMemo } from "react"
import slugify from "slugify"
import customEvents from "~/analytics/customEvents"
import compareMediaLinks from "~/models/compareMediaLinks"
import getImageFileExtension from "../../files/getImageFileExtension"
import DownLoadLink from "./DownloadLink"
import styles from "./index.module.scss"
export interface Props {
    value: Image
}
const EXTENSION_LINKS: Readonly<Record<string, string>> = {
    bmp: "//www.loc.gov/preservation/digital/formats/fdd/fdd000189.shtml",
    gif: "//www.loc.gov/preservation/digital/formats/fdd/fdd000133.shtml",
    jpeg: "//jpeg.org/",
    png: "http://www.libpng.org/pub/png/spec/1.2/PNG-Contents.html",
    svg: "//www.w3.org/TR/SVG/",
}
const EXTENSION_TITLES: Readonly<Record<string, string>> = {
    bmp: "Microsoft Windows Bitmap",
    gif: "Graphics Interchange Format",
    jpeg: "Joint Photographic Experts Group",
    png: "Portable Network Graphics",
    svg: "Scalable Vector Graphics",
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
                <tr key="vector">
                    <th>
                        {sourceFileExtension === "SVG" ? "Vector" : "Vectorized"} File (
                        <a
                            href={EXTENSION_LINKS.svg}
                            onClick={() => customEvents.clickLink("svg", EXTENSION_LINKS.svg, "SVG", "link")}
                            rel="external"
                        >
                            <abbr title={EXTENSION_TITLES.svg}>SVG</abbr>
                        </a>
                        )
                    </th>
                    <td className={styles.cellList}>
                        <DownLoadLink filenamePrefix={filenamePrefix} link={value._links.vectorFile} />
                        &nbsp;
                        <i>(Scales to any resolution. May look different from original.)</i>
                    </td>
                </tr>
                <tr key="raster">
                    <th>
                        Alternate Sizes (
                        <a
                            href={EXTENSION_LINKS.png}
                            onClick={() => customEvents.clickLink("png_alternate", EXTENSION_LINKS.png, "PNG", "link")}
                            rel="external"
                        >
                            <abbr title={EXTENSION_TITLES.png}>PNG</abbr>
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
                        <a
                            href={EXTENSION_LINKS.png}
                            onClick={() => customEvents.clickLink("png_thumbnail", EXTENSION_LINKS.png, "PNG", "link")}
                            rel="external"
                        >
                            <abbr title={EXTENSION_TITLES.png}>PNG</abbr>
                        </a>
                        )
                    </th>
                    <td className={styles.cellList}>
                        {thumbnailFiles.map(link => (
                            <DownLoadLink key={link.href} filenamePrefix={filenamePrefix} link={link} />
                        ))}
                    </td>
                </tr>
                <tr key="source">
                    <th>
                        Original File (
                        <a
                            href={EXTENSION_LINKS[sourceFileExtension.toLowerCase()]}
                            onClick={() =>
                                customEvents.clickLink(
                                    "source",
                                    EXTENSION_LINKS[sourceFileExtension.toLowerCase()],
                                    sourceFileExtension,
                                    "link",
                                )
                            }
                            rel="external"
                        >
                            <abbr title={EXTENSION_TITLES[sourceFileExtension.toLowerCase()]}>
                                {sourceFileExtension}
                            </abbr>
                        </a>
                        )
                    </th>
                    <td className={styles.cellList}>
                        <DownLoadLink filenamePrefix={filenamePrefix} link={value._links.sourceFile} />
                        {sourceFileExtension === "SVG" ? (
                            <>
                                &nbsp;
                                <i>(Scales to any resolution.)</i>
                            </>
                        ) : null}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
export default ImageFilesView
