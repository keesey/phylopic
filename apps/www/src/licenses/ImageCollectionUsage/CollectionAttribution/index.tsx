import { ImageWithEmbedded } from "@phylopic/api-models"
import { compareStrings, isPublicDomainLicenseURL, Nomen, stringifyNomen, UUIDish } from "@phylopic/utils"
import { FC, Fragment, useMemo } from "react"
import NomenView from "~/views/NomenView"
import styles from "./index.module.scss"
import PermalinkButton from "./PermalinkButton"
export interface Props {
    images: readonly ImageWithEmbedded[]
    uuid: UUIDish
}
const contains = (nomina: readonly Nomen[], nomen: Nomen) => {
    const json = JSON.stringify(nomen)
    return nomina.some(n => JSON.stringify(n) === json)
}
const CollectionAttribution: FC<Props> = ({ images, uuid }) => {
    const attributionRequired = useMemo(
        () => images.some(image => !isPublicDomainLicenseURL(image._links.license.href)),
        [images],
    )
    const attributions = useMemo<Record<string, readonly Nomen[]>>(() => {
        const record: Record<string, Nomen[]> = {}
        for (const image of images) {
            if (image.attribution) {
                const nomen = image._embedded.specificNode?.names[0]
                if (record[image.attribution]) {
                    if (nomen && !contains(record[image.attribution], nomen)) {
                        record[image.attribution] = [...record[image.attribution], nomen].sort((a, b) =>
                            compareStrings(stringifyNomen(a), stringifyNomen(b)),
                        )
                    }
                } else {
                    record[image.attribution] = nomen ? [nomen] : []
                }
            }
        }
        return record
    }, [images])
    const separator = useMemo(() => {
        return Object.keys(attributions).some(attribution => attribution.indexOf(",") >= 0) ? ";" : ","
    }, [attributions])
    const hasAttribution = Object.keys(attributions).length > 0
    return (
        <div className={styles.main}>
            {!attributionRequired && !hasAttribution && "Attribution is not required."}
            {attributionRequired && !hasAttribution && (
                <>
                    Attribution must be given to <strong>Anonymous</strong>.
                </>
            )}
            {!attributionRequired && hasAttribution && "Attribution is not required, but may optionally be given as:"}
            {attributionRequired && hasAttribution && "Attribution is required, and may be given as:"}
            {hasAttribution && (
                <blockquote>
                    Silhouette {images.length === 1 ? "image is" : "images are"} by{" "}
                    {Object.entries(attributions)
                        .sort((a, b) => compareStrings(a[0], b[0]))
                        .map(([attribution, nomina], index, array) => (
                            <Fragment key={attribution}>
                                {index && array.length > 2 ? separator : null}
                                {index && index === array.length - 1 ? " and " : " "}
                                {attribution}
                                {nomina.length > 0 && (
                                    <span>
                                        {" "}
                                        (
                                        {nomina.map((nomen, index) => (
                                            <Fragment key={JSON.stringify(nomen)}>
                                                {index > 0 && ", "}
                                                <NomenView key={JSON.stringify(nomen)} short value={nomen} />
                                            </Fragment>
                                        ))}
                                        )
                                    </span>
                                )}
                            </Fragment>
                        ))}
                    .
                </blockquote>
            )}
            {attributionRequired && (
                <>
                    Alternately,{" "}
                    <strong>
                        <PermalinkButton uuid={uuid}>click here to create a permalink for attribution</PermalinkButton>
                    </strong>
                    .
                </>
            )}
        </div>
    )
}
export default CollectionAttribution
