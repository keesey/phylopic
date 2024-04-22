"use client"
import { Image } from "@phylopic/api-models"
import { ImageThumbnailView, ImageThumbnailViewProps, fetchJSON } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
export type Props = Omit<ImageThumbnailViewProps, "value"> & {
    uuid: UUID
}
export const ImageUUIDThumbnailView: FC<Props> = ({ uuid, ...props }) => {
    const { data } = useSWR<Image>(`${process.env.NEXT_PUBLIC_API_URL}/images/${encodeURIComponent(uuid)}`, fetchJSON)
    if (!data) {
        return (
            <svg width={64} height={64} viewBox="0 0 64 64">
                <circle cx={32} cy={32} r={32} fill="rgba(0,0,0,0.2)" />
            </svg>
        )
    }
    return <ImageThumbnailView value={data} {...props} />
}
