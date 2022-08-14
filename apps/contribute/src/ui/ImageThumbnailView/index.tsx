import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useImageSrc from "~/editing/hooks/useImageSrc"
import FileThumbnailView from "../FileThumbnailView"
import Status from "./Status"
export type Props = {
    value?: Image & { uuid: UUID }
}
const ImageThumbnailView: FC<Props> = ({ value }) => {
    const src = useImageSrc(value?.uuid)
    const alt = useMemo(() => {
        if (value) {
            if (value.accepted) {
                if (value.submitted) {
                    return "Accepted Submission"
                }
                return "Withdrawn Submission"
            }
            if (value.submitted) {
                return "Pending Submission"
            }
            return "Incomplete Submission"
        }
    }, [value])
    return (
        <figure>
            <FileThumbnailView alt={alt} src={src} />
            <figcaption>
                <Status image={value} />
            </figcaption>
        </figure>
    )
}
export default ImageThumbnailView