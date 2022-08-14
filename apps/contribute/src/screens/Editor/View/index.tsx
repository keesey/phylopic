import { useRouter } from "next/router"
import { FC, useCallback } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import useImageUUID from "~/editing/hooks/useImageUUID"
import ImageView from "~/ui/ImageView"
const View: FC = () => {
    const uuid = useImageUUID()
    const image = useImage(uuid)
    const src = useImageSrc(uuid)
    const specific = useImageNode(uuid, "specific")
    const general = useImageNode(uuid, "general")
    const router = useRouter()
    const handleEdit = useCallback(
        (section: "file" | "nodes" | "usage") => {
            if (uuid) {
                router.push(`/edit/${encodeURIComponent(uuid)}/${encodeURIComponent(section)}`)
            }
        },
        [router, uuid],
    )
    return (
        <ImageView
            attribution={image?.attribution}
            general={general}
            license={image?.license}
            onEdit={handleEdit}
            specific={specific}
            src={src}
        />
    )
}
export default View
