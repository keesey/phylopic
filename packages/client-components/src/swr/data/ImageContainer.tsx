import type { ImageParameters, ImageWithEmbedded } from "@phylopic/api-models"
import type { UUID } from "@phylopic/utils"
import React from "react"
import { DataContainer, type DataContainerProps } from "./DataContainer"

export type ImageContainerProps = Omit<DataContainerProps<ImageWithEmbedded>, "endpoint"> & {
    query?: Omit<ImageParameters, "uuid">
    uuid: UUID
}

export const ImageContainer: React.FC<ImageContainerProps> = ({ uuid, ...dataContainerProps }) => {
    const endpoint = React.useMemo(
        () => process.env.NEXT_PUBLIC_API_URL + "/images/" + encodeURIComponent(uuid),
        [uuid],
    )
    return <DataContainer endpoint={endpoint} {...(dataContainerProps as Partial<DataContainerProps>)} />
}
