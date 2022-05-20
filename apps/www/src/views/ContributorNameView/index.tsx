import { Contributor } from "@phylopic/api-models"
import { FC, useMemo } from "react"
import getContributorName from "~/models/getContributorName"
export interface Props {
    value?: Contributor
}
const ContributorNameView: FC<Props> = ({ value }) => {
    const name = useMemo(() => getContributorName(value), [value])
    return <>{name}</>
}
export default ContributorNameView
