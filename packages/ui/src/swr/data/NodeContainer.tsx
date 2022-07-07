import { NodeParameters, NodeWithEmbedded } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import React from "react"
import { DataContainer, DataContainerProps } from "./DataContainer"
export type NodeContainerProps = Omit<DataContainerProps<NodeWithEmbedded>, "endpoint"> & {
    query?: Omit<NodeParameters, "uuid">
    uuid: UUID
}
export const NodeContainer: React.FC<NodeContainerProps> = ({ uuid, ...dataContainerProps }) => {
    const endpoint = React.useMemo(() => process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid, [uuid])
    return <DataContainer endpoint={endpoint} {...(dataContainerProps as Partial<DataContainerProps>)} />
}
