import { ImageWithEmbedded } from "@phylopic/api-models"
import { useMemo } from "react"
import useLicenseText from "~/hooks/useLicenseText"
import useNomenText from "~/hooks/useNomenText"
const useImageAlt = (image: ImageWithEmbedded) => {
    const specificName = useNomenText(image._embedded?.specificNode?.names[0], true)
    const license = useLicenseText(image._links.license.href, true)
    return useMemo(
        () =>
            [
                specificName ?? "Untitled",
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
