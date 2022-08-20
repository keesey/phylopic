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
                "by",
                image.attribution ?? "Anonymous",
                image.sponsor ? `, sponsored by ${image.sponsor}` : null,
                `(${license})`,
            ]
                .filter(Boolean)
                .join(" "),
        [license, specificName, image],
    )
}
export default useImageAlt
