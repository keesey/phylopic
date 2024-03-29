import { Contributor, ContributorParameters } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import React from "react"
import { DataContainer, DataContainerProps } from "./DataContainer"
export type ContributorContainerProps = Omit<DataContainerProps<Contributor>, "endpoint"> & {
    query?: Omit<ContributorParameters, "uuid">
    uuid: UUID
}
export const ContributorContainer: React.FC<ContributorContainerProps> = ({ uuid, ...dataContainerProps }) => {
    const endpoint = React.useMemo(
        () => process.env.NEXT_PUBLIC_API_URL + "/contributors/" + encodeURIComponent(uuid),
        [uuid],
    )
    return <DataContainer endpoint={endpoint} {...(dataContainerProps as Partial<DataContainerProps>)} />
}
