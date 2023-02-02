import { Image, ImageWithEmbedded } from "@phylopic/api-models"
import { useMemo } from "react"
import useLicenseText from "./useLicenseText"
import useNomenText from "./useNomenText"
export const useImageAlt = (image: Image | ImageWithEmbedded) => {
    const specificName = useNomenText((image as ImageWithEmbedded)._embedded?.specificNode?.names[0], true)
    const license = useLicenseText(image._links.license.href, true)
    return useMemo(
        () =>
            [
                specificName ?? "Image",
                image.attribution ? `by ${image.attribution}` : null,
                image.sponsor ? `, sponsored by ${image.sponsor}` : null,
                `(${license})`,
            ]
                .filter(Boolean)
                .join(" ")
                .replace(/\s,/, ","),
        [license, specificName, image],
    )
}
export default useImageAlt
