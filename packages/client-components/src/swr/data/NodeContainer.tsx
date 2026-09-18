import type { NodeParameters, NodeWithEmbedded } from "@phylopic/api-models"
import type { UUID } from "@phylopic/utils"
import React from "react"
import { DataContainer, type DataContainerProps } from "./DataContainer"
export type NodeContainerProps = Omit<DataContainerProps<NodeWithEmbedded>, "endpoint"> & {
    query?: Omit<NodeParameters, "uuid">
    uuid: UUID
}
export const NodeContainer: React.FC<NodeContainerProps> = ({ uuid, ...dataContainerProps }) => {
    const endpoint = React.useMemo(() => process.env.NEXT_PUBLIC_API_URL + "/nodes/" + encodeURIComponent(uuid), [uuid])
    return <DataContainer endpoint={endpoint} {...(dataContainerProps as Partial<DataContainerProps>)} />
}
