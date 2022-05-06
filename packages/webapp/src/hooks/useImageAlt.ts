import { ImageWithEmbedded } from "@phylopic/api-models"
import { useMemo } from "react"
import useLicenseText from "~/hooks/useLicenseText"
import useNameText from "~/hooks/useNameText"
const useImageAlt = (image: ImageWithEmbedded) => {
    const specificName = useNameText(image._embedded?.specificNode?.names[0], true)
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
