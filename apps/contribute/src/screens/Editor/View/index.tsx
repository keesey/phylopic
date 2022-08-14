import { Node } from "@phylopic/api-models"
import { useAPIFetcher } from "@phylopic/utils-api"
import { useRouter } from "next/router"
import { FC, useCallback } from "react"
import useSWRImmutable from "swr/immutable"
import useImage from "~/editing/hooks/useImage"
import useImageSrc from "~/editing/hooks/useImageSrc"
import useImageUUID from "~/editing/hooks/useImageUUID"
import ImageView from "~/ui/ImageView"
const View: FC = () => {
    const uuid = useImageUUID()
    const image = useImage(uuid)
    const src = useImageSrc(uuid)
    const apiFetcher = useAPIFetcher<Node>()
    const { data: specific } = useSWRImmutable(
        image?.specific ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(image.specific)}` : null,
        apiFetcher,
    )
    const { data: general } = useSWRImmutable(
        image?.general ? `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(image.general)}` : null,
        apiFetcher,
    )
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
