import { Image, ImageWithEmbedded } from "@phylopic/api-models"
import { useMemo } from "react"
import useLicenseText from "./useLicenseText"
import useNomenText from "./useNomenText"
export const useImageAlt = (image: Image | ImageWithEmbedded | null | undefined) => {
    const specificName = useNomenText(
        (image as ImageWithEmbedded | undefined)?._embedded?.specificNode?.names[0] ?? undefined,
        true,
    )
    const license = useLicenseText(image?._links.license.href, true)
    return useMemo(
        () =>
            [
                specificName ?? "Image",
                image?.attribution ? `by ${image.attribution}` : null,
                image?.sponsor ? `, sponsored by ${image.sponsor}` : null,
                license ? `(${license})` : null,
            ]
                .filter(Boolean)
                .join(" ")
                .replace(/\s,/, ","),
        [license, specificName, image],
    )
}
export default useImageAlt
