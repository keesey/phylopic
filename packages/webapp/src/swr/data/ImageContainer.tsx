import { Contributor, ImageParameters } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import DataContainer, { Props as DataContainerProps } from "./DataContainer"
export type Props = Omit<DataContainerProps<Contributor>, "endpoint"> & {
    query?: Omit<ImageParameters, "uuid">
    uuid: UUID
}
const ImageContainer: FC<Props> = ({ uuid, ...dataContainerProps }) => {
    const endpoint = useMemo(() => process.env.NEXT_PUBLIC_API_URL + "/images/" + uuid, [uuid])
    return <DataContainer endpoint={endpoint} {...(dataContainerProps as Partial<DataContainerProps>)} />
}
export default ImageContainer
