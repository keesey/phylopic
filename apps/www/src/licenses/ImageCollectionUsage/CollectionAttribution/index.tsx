import { ImageWithEmbedded } from "@phylopic/api-models"
import { compareStrings, isPublicDomainLicenseURL, Nomen, stringifyNomen, UUIDish } from "@phylopic/utils"
import { FC, Fragment, useMemo } from "react"
import styles from "./index.module.scss"
import Nomina from "./Nomina"
import PermalinkButton from "./PermalinkButton"
export interface Props {
    images: readonly ImageWithEmbedded[]
    uuid?: UUIDish
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
    const [attributions, unattributed] = useMemo<[Record<string, readonly Nomen[]>, readonly Nomen[]]>(() => {
        const record: Record<string, Nomen[]> = {}
        const unattributed: Nomen[] = []
        for (const image of images) {
            const nomen = image._embedded.specificNode?.names[0]
            if (image.attribution) {
                if (record[image.attribution]) {
                    if (nomen && !contains(record[image.attribution], nomen)) {
                        record[image.attribution] = [...record[image.attribution], nomen].sort((a, b) =>
                            compareStrings(stringifyNomen(a), stringifyNomen(b)),
                        )
                    }
                } else {
                    record[image.attribution] = nomen ? [nomen] : []
                }
            } else if (nomen) {
                unattributed.push(nomen)
            }
        }
        return [record, unattributed.sort((a, b) => compareStrings(stringifyNomen(a), stringifyNomen(b)))]
    }, [images])
    const separator = useMemo(() => {
        return Object.keys(attributions).some(attribution => attribution.indexOf(",") >= 0) ? ";" : ","
    }, [attributions])
    const attributionEntries = useMemo(
        () => Object.entries(attributions).sort((a, b) => compareStrings(a[0], b[0])),
        [attributions],
    )
    const numAttributions = attributionEntries.length
    const hasAttributions = numAttributions > 0
    return (
        <div id="attribution" className={styles.main}>
            {!attributionRequired && !hasAttributions && "Attribution is not required."}
            {attributionRequired && !hasAttributions && (
                <>
                    Attribution must be given to <strong>Anonymous</strong>.
                </>
            )}
            {hasAttributions &&
                `Attribution is ${attributionRequired ? "" : "not "}required, ${
                    attributionRequired ? "and" : "but"
                } may be given as:`}
            {hasAttributions && (
                <blockquote>
                    Silhouette image{images.length === 1 ? "" : "s"} {images.length === 1 ? "is" : "are"} by{" "}
                    {Object.entries(attributions)
                        .sort((a, b) => compareStrings(a[0], b[0]))
                        .map(([attribution, nomina], index, array) => (
                            <Fragment key={attribution}>
                                {index > 0 && array.length + (unattributed.length > 0 ? 1 : 0) > 2 ? separator : null}
                                {index > 0 && unattributed.length === 0 && index === array.length - 1 ? " and " : " "}
                                {attribution}
                                {(numAttributions > 1 || unattributed.length > 0) && <Nomina nomina={nomina} />}
                            </Fragment>
                        ))}
                    {unattributed.length > 0 && (
                        <>
                            {numAttributions >= 2 && separator} and others
                            <Nomina nomina={unattributed} />
                        </>
                    )}
                    .
                </blockquote>
            )}
            {attributionRequired && uuid && (
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
