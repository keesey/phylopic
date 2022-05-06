import { NodeParameters, NodeWithEmbedded } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils/dist/models/types"
import { FC, useMemo } from "react"
import DataContainer, { Props as DataContainerProps } from "./DataContainer"
export type Props = Omit<DataContainerProps<NodeWithEmbedded>, "endpoint"> & {
    query?: Omit<NodeParameters, "uuid">
    uuid: UUID
}
const NodeContainer: FC<Props> = ({ uuid, ...dataContainerProps }) => {
    const endpoint = useMemo(() => process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid, [uuid])
    return <DataContainer endpoint={endpoint} {...(dataContainerProps as Partial<DataContainerProps>)} />
}
export default NodeContainer
