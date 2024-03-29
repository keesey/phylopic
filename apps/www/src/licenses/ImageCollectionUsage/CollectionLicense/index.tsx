import { ImageWithEmbedded } from "@phylopic/api-models"
import { NumberView } from "@phylopic/ui"
import { isPublicDomainLicenseURL, LICENSE_NAMES } from "@phylopic/utils"
import { FC } from "react"
import customEvents from "~/analytics/customEvents"
import useCollectionLicense from "./useCollectionLicense"
export interface Props {
    images: readonly ImageWithEmbedded[]
}
const CollectionLicense: FC<Props> = ({ images }) => {
    const license = useCollectionLicense(images)
    if (!images.length) {
        return null
    }
    if (isPublicDomainLicenseURL(license)) {
        return (
            <p>
                There are no licensing requirements for the use of{" "}
                {images.length === 1 ? "this silhouette image" : "these silhouette images"}.
            </p>
        )
    }
    return (
        <p id="license">
            Any work that uses{" "}
            {images.length === 1 ? (
                "this silhouette image"
            ) : (
                <>
                    {images.length === 2 ? (
                        "both"
                    ) : (
                        <>
                            all <NumberView value={images.length} />
                        </>
                    )}{" "}
                    of these silhouette images{" "}
                </>
            )}
            should be made available under the{" "}
            <strong>
                <a
                    href={license}
                    onClick={() =>
                        customEvents.clickLink("collection_license", license, LICENSE_NAMES[license], "link")
                    }
                    target="_blank"
                    rel="noreferrer"
                >
                    {LICENSE_NAMES[license]}
                </a>
            </strong>{" "}
            license.
        </p>
    )
}
export default CollectionLicense
