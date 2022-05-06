import { Node } from "@phylopic/api-models"
import { UUID } from "@phylopic/utils/dist/models/types"
import { FC, useCallback, useState } from "react"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import { BreadcrumbItem } from "../Breadcrumbs"
import Collapsed from "./Collapsed"
import Expanded from "./Expanded"
import Static from "./Static"
export interface Props {
    afterItems: readonly BreadcrumbItem[]
    beforeItems: readonly BreadcrumbItem[]
    uuid?: UUID
}
const ExpandableLineageBreadcrumbs: FC<Props> = ({ afterItems, beforeItems, uuid }) => {
    const [active, setActive] = useState(false)
    const handleActiveButtonClick = useCallback(() => setActive(true), [])
    if (!uuid) {
        return <Static afterItems={afterItems} beforeItems={beforeItems} />
    }
    if (!active) {
        return <Collapsed afterItems={afterItems} beforeItems={beforeItems} onClick={handleActiveButtonClick} />
    }
    return (
        <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/nodes/${uuid}/lineage`} hideLoader>
            {values => (
                <Expanded afterItems={afterItems} beforeItems={beforeItems} values={values as readonly Node[]} />
            )}
        </PaginationContainer>
    )
}
export default ExpandableLineageBreadcrumbs
