import { Contributor, ContributorParameters } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils/dist/models/types"
import { FC, useMemo } from "react"
import DataContainer, { Props as DataContainerProps } from "./DataContainer"
export type Props = Omit<DataContainerProps<Contributor>, "endpoint"> & {
    query?: Omit<ContributorParameters, "uuid">
    uuid: UUID
}
const ContributorContainer: FC<Props> = ({ uuid, ...dataContainerProps }) => {
    const endpoint = useMemo(() => process.env.NEXT_PUBLIC_API_URL + "/contributors/" + uuid, [uuid])
    return <DataContainer endpoint={endpoint} {...(dataContainerProps as Partial<DataContainerProps>)} />
}
export default ContributorContainer
